const _ = require('lodash');
const { LocalDate } = require('js-joda');
const { generateSchedule } = require('./jsch');
const {attachAuxData} = require('./attachAuxData');
const {queryButler, queryAuxData} = require('./queries');
const {
  workDayHash,
  makeHashMap,
  analyseSchedule,
  parseWhereIn
} = require('./helper');


class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  parseNextDate(params){
    const startDate = _.get(params.query, 'startDate');
    if (startDate)
      return LocalDate.parse(startDate);
  }

  extractIdsFromVisits(visits){
    const serviceIds = new Set();
    const butlerIds = new Set();
    const clientIds = new Set();
    for(const visit of visits){
      serviceIds.add(visit.serviceId);
      butlerIds.add(visit.butlerId);
      clientIds.add(visit.clientId);
    }

    return {
      serviceIds: [...serviceIds],
      butlerIds: [...butlerIds],
      clientIds: [...clientIds],
    };
  }

  auxDataRequired(params){
    if (_.get(params.query, 'dumpAuxMulti', false)){
      return true;
    }

    return false;
  }

  canLoadAuxVisits(params, nextDate){
    if (_.get(params.query, 'skipFuturePlans') === 'yes'){
      return false;
    }

    if (this.auxDataRequired(params) && nextDate){
      return true;
    }

    return false;
  }

  hasButlerId(params){
    return params.query.butlerId && !Array.isArray(params.query.butlerId) && !params.query.butlerId.$in;
  }


  async find(params) {
    const visitsPromise = this.app.service('visits').find({ query: params.query });
    const workDaysPromise = this.app.service('workDays').find({ query: params.query });

    const isAuxRequired = this.auxDataRequired(params);
    const nextDate = this.parseNextDate(params);
    const giveExtraButlerData = params.query.giveExtraButlerData;
    const knex = this.app.get('knexClient');

    const visits = await visitsPromise;

    const idsToFetch = this.extractIdsFromVisits(visits);

    // visits used to check futurePlans (see end date)
    // when skipFuturePlans set to yes aux visits will not be loaded
    let auxVisitsPromise = Promise.resolve([]);
    if (this.canLoadAuxVisits(params, nextDate)){
      auxVisitsPromise = this.app.service('visits').find({
        query: {
          serviceId: {$in: idsToFetch.serviceIds},
          startDate: nextDate.plusDays(1).toString(),
          endDate: nextDate.plusWeeks(4).toString()
        }
      });
    }

    // load butlers
    let butlerPromise;
    if (this.hasButlerId(params)){
      butlerPromise = await this.app.service('butlers').find({
        query: {
          id : params.query.butlerId
        }
      });
    }else{
      butlerPromise = queryButler(knex, idsToFetch.butlerIds);
    }

    // data used in attachAuxData
    let auxDataMapPromise = Promise.resolve({});
    if (isAuxRequired){
      auxDataMapPromise = queryAuxData(knex, idsToFetch.serviceIds);
    }

    const visitGroups = _.values(_.groupBy(visits, v => v.butlerId + '#' + v.date.toString()));

    let butlers;
    if (this.hasButlerId(params)){
      butlers = (await butlerPromise).reduce((m, b)=> m.set(b.id, b), new Map());
    }else{
      butlers = await butlerPromise;
    }

    const workDays = makeHashMap(await workDaysPromise);
    const schedulesPromise = [];
    for (const visitGroup of visitGroups){
      const butlerId = visitGroup[0].butlerId;
      const date = visitGroup[0].date;

      const workDay = workDays.get(workDayHash(butlerId, date));
      const hasCar = butlers.get(butlerId).hasCar;
      schedulesPromise.push(generateSchedule(visitGroup, workDay, hasCar));
    }

    const schedules = await Promise.all(schedulesPromise);
    const todoItemList = await this.getTODOList(params, schedules, idsToFetch.clientIds);

    const result = _.zipWith(visitGroups, schedules, (visitGroup, schedule) => {
      const butlerId = visitGroup[0].butlerId;
      const date = visitGroup[0].date;
      const butler = butlers.get(butlerId);
      if (butler) {
        delete butler.password;
      }
      let output = { butlerId, butler, date }

      schedule.anchoredVisits = schedule.anchoredVisits.map(anchoredVisit => {
        const visit = visitGroup[anchoredVisit.visitIdx];
        anchoredVisit.clientToDoItems = todoItemList.filter(x => x.clientId == visit.clientId)
        if (giveExtraButlerData) {
          anchoredVisit.butlerFirstVisit = visit.butlersCount == 1 && !(visit.visitsCount > 0)
        }
        return Object.assign(visit, anchoredVisit)
      });

      // Associate work day details with this schedule
      const workDay = workDays.get(workDayHash(butlerId, date));
      let butlerWorkDayDetails = {
        butlerAvailable: false
      };

      if (workDay) {
        butlerWorkDayDetails = {
          butlerAvailable: true,
          butlerWindowStartTime: workDay.windowStartTime,
          butlerWindowEndTime: workDay.windowEndTime,
          butlerAddressId: workDay.butlerAddressId
        };
      }

      if (!params.query.reducedPayload) {
        output = Object.assign(output, { ...butlerWorkDayDetails, ...schedule })
      }
      return output;
    });

    if (isAuxRequired === false && result.length === 1){
      // legacy check, auto dump aux data when result length is 1
      auxVisitsPromise = this.app.service('visits').find({
        query: {
          serviceId: {$in: idsToFetch.serviceIds},
          startDate: nextDate.plusDays(1).toString(),
          endDate: nextDate.plusWeeks(4).toString()
        }
      });
      auxDataMapPromise = queryAuxData(knex, idsToFetch.serviceIds);
      return attachAuxData(auxVisitsPromise, auxDataMapPromise, result, nextDate);
    }


    if (isAuxRequired){
      return attachAuxData(auxVisitsPromise, auxDataMapPromise, result, nextDate);
    }

    return result.map(schedule => ({...schedule, analysis: analyseSchedule(schedule)}));
  }


  async getTODOList(params, schedules, clientIds){
    if (clientIds.length === 0){
      return [];
    }

    if (!params.query.butlerId || !schedules[0]) {
      return [];
    }

    // visit is requested by only one butler. get toDoList
    const query = await this.app.get('knexClient').raw(`
      SELECT
        "clientToDoItems"."id",
        "clientToDoItems"."summary",
        "clientToDoItems"."clientId",
        "clientToDoItemPictures"."id" as "clientToDoItemPictureId",
        "clientToDoItemPictures"."clientToDoItemId",
        "clientToDoItemPictures"."imageUrl"
      FROM "clientToDoItems"
      left join "clientToDoItemPictures" on "clientToDoItems"."id" = "clientToDoItemPictures"."clientToDoItemId"
      where "clientId" in (${parseWhereIn(clientIds)})
    `);


    const todoItemList = [];
    const toDoListItemsForClients = _.groupBy(query.rows, 'id');
    Object.keys(toDoListItemsForClients).filter(todoItemId => {
      const todoListItem = toDoListItemsForClients[todoItemId];
      todoItemList.push({
        id :todoItemId,
        summary: todoListItem[0].summary,
        clientId:  todoListItem[0].clientId,
        pictures: todoListItem.map(x=>{
          return {
            imageUrl: x.imageUrl,
            clientToDoItemPictureId: x.clientToDoItemPictureId,
            clientToDoItemId:todoItemId
          };
        })
      });
    });

    return todoItemList;
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
