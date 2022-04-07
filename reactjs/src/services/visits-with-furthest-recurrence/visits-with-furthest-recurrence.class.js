const _ = require('lodash');
const { LocalDate } = require('js-joda');


class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  /**
    * Way we check future plans by requesting future visits.
    *
    * In allocations we request 8 days of visits.
    *
    * This api works best when we request few days of data
    */
  async find(params) {
    const knex = this.app.get('knexClient')
    const nextWeekVisitsPromise = this.app
      .service('visits')
      .find({query: {
        ...params.query,
        startDate: params.query.endDate,
        endDate: LocalDate.parse(params.query.endDate).plusDays(8).toString()}
      });
    const visits = await this.app.service('visits').find({ query: params.query });
    const nextWeekVisits = await nextWeekVisitsPromise;
    const visitsMap = this.hasFutureVisits(visits.concat(nextWeekVisits))
    const visitsToAllClient = await knex('visitPlans')
      .select('id as visitPlanId', 'serviceId', knex.raw('lower("dateRange") as startDate'))
      .whereIn('serviceId', visits.map(x => x.serviceId))
      .orderBy(knex.raw('lower("dateRange")'))
    for (const visit of visits) {
      const clientVisits = visitsMap.get(visit.serviceId) || [];
      // visit.futureVisits = _.rest(clientVisits);
      visit.furthestRecurrence = _.get(_.last(clientVisits), 'recurrence', visit.visitPlanRecurrence);
      visit.furthestRecurrenceName = this.recurrenceName(visit.furthestRecurrence);
      visit.firstVisitOfThisService = this.isFirstVisit(visit, visitsToAllClient)
    }
    return visits;
  }

  isFirstVisit(visit, visits) {
    const groupByServiceId = visits.filter(v => v.serviceId == visit.serviceId)
    const index = groupByServiceId.findIndex(g => g.visitPlanId == visit.visitPlanId)
    return index < 1
  }

  hasFutureVisits(visits) {
    const ret = new Map();
    for (const visit of visits) {
      const { serviceId, date, visitPlanRecurrence } = visit;
      if (visitPlanRecurrence === 'n'){
        continue;
      }

      const entry = ret.get(serviceId) || [];
      entry.push({ date, recurrence:visitPlanRecurrence });
      ret.set(serviceId, entry);
    }

    return ret;
  }

  recurrenceName(recurrence){
    if (recurrence === 'w'){
      return 'Weekly';
    }

    if (recurrence === 'f'){
      return 'Fortnightly';
    }

    if (recurrence === 'n'){
      return 'One Off';
    }
  }



  get(id, params) {
    return Promise.resolve(id);
  }

  create(data, params) {
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

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
