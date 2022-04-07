
const grantVisitsFromManagedScheduleList = require('./logic/grant-visits-from-managed-schedule-list');
const prepareManagedScheduleData = require('./logic/prepare-managed-schedule-data');
const filterOutButlers = require('./logic/filter-out-butlers');
const groupBy = require('../../helpers/group-by');
const dedupe = require('../../helpers/dedupe');
const { LocalDate } = require('js-joda');
const moment = require('moment');

function getAllIndexes(arr, val) {
  var indexes = [], i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(params) {
    console.log("getting schedules",params);

    let { startDate, endDate, getNotEnrolledButlers, getFrozenButlers,takeNotRealRequestsOnly } = params.query;
    endDate = LocalDate.parse(endDate).plusDays(1).toString(); //we need this to match the right end of the date
    
    const allocationOptions = (await this.app.service('allocationSettings').find())[0];

    const churnPerClientSettings = (await this.app.service('churnPerClientSettings').find())[0];

    const excludedButlers = await this.app.service('serviceExcludedButlers').find();

    const { managedScheduleButlers, nonManagedScheduleButlers, managedScheduleButlerVisits, visitsRequestedByButlers, pausesForAllButlers } = await prepareManagedScheduleData(this.app, startDate, endDate, allocationOptions, getNotEnrolledButlers, getFrozenButlers,takeNotRealRequestsOnly);
    // ///To start with, Butlers who are in MSP should be considered against ALL visits. 
    // matchManagedScheduleButlersAgainstVisits(managedScheduleButlers, managedScheduleButlerVisits);
    // //Butlers NOT in MSP should only be considered against the visits they requested.
    // matchNonManagedScheduleButlersAgainstVisits(nonManagedScheduleButlers);  

    let butlersMatchedAgainstVisits = await filterOutButlers(this.app, managedScheduleButlers, managedScheduleButlerVisits, nonManagedScheduleButlers, startDate, allocationOptions,churnPerClientSettings,visitsRequestedByButlers, pausesForAllButlers);

    if (params.query.attachVisitPlans){
      await this.attachVisitPlans(butlersMatchedAgainstVisits);
    }

    //dedupe results 
    const groupedData = groupBy(butlersMatchedAgainstVisits, function (item) {
      return [item.visit.visitPlanId.toString(), item.visit.startDate.toString()];
    });

    for (const property in groupedData) {//grouping by id is not enough, also group by date

      if (groupedData[property].length > 1) {
        const groupedId = groupedData[property].map(x=> x.visit.visitPlanId + x.visit.startDate.toString())[0];

        const butlersForThisVisit = groupedData[property].map(x => x.butlersWantingThisVisit);
        let mergedButlers = [];
        for (const butler of butlersForThisVisit) {
          mergedButlers = [...mergedButlers, ...butler];
        }
        const dedupedButlers = dedupe(mergedButlers, 'id');
        const indexesToReplace = butlersMatchedAgainstVisits.reduce(function (a, e, i) {
          if (e && (e.visit.visitPlanId + e.visit.startDate.toString()) === groupedId)
            a.push(i);
          return a;
        }, []);
        indexesToReplace.forEach((x, i) => {
          if (i == 0) { //leave the first ocurrence of this visit
            butlersMatchedAgainstVisits[x].butlersWantingThisVisit = dedupedButlers;
          } else { //remove all future ocurrences 
            butlersMatchedAgainstVisits[x] = null; //we cannot splice here otherwise we need to find all indexes again
          }
        });
      }
    }

    butlersMatchedAgainstVisits = butlersMatchedAgainstVisits.filter(x => x);//remove nulls 
    const sortButlersByRating = (a, b) => {
      return b.rating - a.rating;
    };

    const sortVisitsByClientValue = (a, b) => {
      return b.visit.service.client.clientValue - a.visit.service.client.clientValue;
    };

    let index = 0;
    for (const bmav of butlersMatchedAgainstVisits) {
      for (const bwtv of bmav.butlersWantingThisVisit) {
        delete bwtv.alreadyAllocatedVisits; //delete this to reduce payload
        delete bwtv.processedVisitsList; //delete this to reduce payload

        if (!bwtv.processed) {
          bwtv.originalRating = bwtv.rating;
          bwtv.rating = parseFloat(bwtv.rating);
          if (bmav.visit.butlersWhoRequestedThisVisit && bmav.visit.butlersWhoRequestedThisVisit.indexOf(bwtv.id) > -1) {
            bwtv.rating = (bwtv.rating + parseFloat(allocationOptions.premiumRatingPointsForRequestedVisitButlers));
          }

          if (bwtv.gender == 'f') {
            bwtv.rating = (bwtv.rating + parseFloat(allocationOptions.premiumRatingPointsForFemaleButlers));
          }

          bwtv.rating = Math.round(bwtv.rating * 1e2) / 1e2; //this makes the rating have a precision of 2
          bwtv.processed = true;
        }

      }
    }

    for (const bmav of butlersMatchedAgainstVisits) { //cant sort an array while its being used so we need a new for
      const serviceExclusions = excludedButlers.filter(x => x.serviceId.toString() == bmav.visit.serviceId.toString());
      if (serviceExclusions && serviceExclusions.length > 0) {
        bmav.butlersWantingThisVisit = bmav.butlersWantingThisVisit.filter(x => !serviceExclusions.find(z => z.butlerId == x.id));
      }
    }

    for (const bmav of butlersMatchedAgainstVisits) { //cant sort an array while its being used so we need a new for
      bmav.butlersWantingThisVisit.sort(sortButlersByRating);
      butlersMatchedAgainstVisits[index] = bmav;
      index++;
    }


    butlersMatchedAgainstVisits.sort(sortVisitsByClientValue);
      

    const sortVisitsByDate = (a, b) => {
      return new Date(a.visit.startDate.toString()) - new Date(b.visit.startDate.toString());
    };
    butlersMatchedAgainstVisits.sort(sortVisitsByDate);


    //highlight the highest rated butler for each visit if they haven’t already been allocated [>1] visit above
    for (const bmav of butlersMatchedAgainstVisits) {
      bmav.butlersWantingThisVisit = JSON.parse(JSON.stringify(bmav.butlersWantingThisVisit)); //duplicate all butlers 
    }

    

    let butlersFoundBefore = [];
    let currentDate = '';
    for (const bmav of butlersMatchedAgainstVisits) {

      if (bmav.visit.startDate.toString() != currentDate) { //when the day changes we reset all settings and move on
        currentDate = bmav.visit.startDate.toString();
        butlersFoundBefore = [];
      } //for this to work visits must be ordered by date 


      for (const bwtv of bmav.butlersWantingThisVisit) {

        const foundBefore = butlersFoundBefore.find(x => x.butler.id == bwtv.id);
        if (foundBefore) {
          if (foundBefore.timesGivenVisit >= allocationOptions.maxAllocationsForButlerPerRun) {
            //disqualify
          } else {
            if (bmav.butlersWantingThisVisit.filter(x => x.getsVisit).length == 0) { // if nobody got the visit yet, then get the visit
              bwtv.getsVisit = true;
              butlersFoundBefore[butlersFoundBefore.indexOf(foundBefore)].timesGivenVisit += 1;
            }
          }
        } else {
          if (bmav.butlersWantingThisVisit.filter(x => x.getsVisit).length == 0) { // if nobody got the visit yet, then get the visit
            bwtv.getsVisit = true; //if it is the first time the butler has been found then he gets the visit
          }
          butlersFoundBefore.push({
            butler: bwtv,
            timesGivenVisit: (bwtv.getsVisit ? 1 : 0)
          });
        }
      }

    }

    if(params.query.getNotEnrolledButlers || params.query.getFrozenButlers){
      if (butlersMatchedAgainstVisits[0]){
        butlersMatchedAgainstVisits[0].allocationOptions = allocationOptions;
      }
      return butlersMatchedAgainstVisits;
    }
      
      //min requests to auto allocate visits
      let listOfVisitsUnableToAllocateDueToSettings = []
      listOfVisitsUnableToAllocateDueToSettings = butlersMatchedAgainstVisits.filter((x, k) => {
        let reqVisits = 0;
        if('butlersWhoRequestedThisVisit' in x.visit){
          reqVisits = x.visit.butlersWhoRequestedThisVisit.length;
        }

        if(reqVisits < allocationOptions.minRequestsToAutoAllocateVisit){
            return x
        }
        
        // if(allocationOptions.minRequestsToAutoAllocateVisit===0 && reqVisits > 0){
        //     return x
        // }
      });

      //min requests to auto allocate visits
      butlersMatchedAgainstVisits = butlersMatchedAgainstVisits.filter((x, k) => {
        let reqVisits = 0;
        if('butlersWhoRequestedThisVisit' in x.visit){
          reqVisits = x.visit.butlersWhoRequestedThisVisit.length;
          if(allocationOptions.minRequestsToAutoAllocateVisit==0){
            return x
          }else if(reqVisits >= allocationOptions.minRequestsToAutoAllocateVisit && allocationOptions.minRequestsToAutoAllocateVisit!=0){
            return x
          }
        }else if(!('butlersWhoRequestedThisVisit' in x.visit) && allocationOptions.minRequestsToAutoAllocateVisit==0){
          return x;
        }
      });

      if(butlersMatchedAgainstVisits.length==0){
        butlersMatchedAgainstVisits.push({visitsUnableToAllocateDueToSettings: listOfVisitsUnableToAllocateDueToSettings})
        butlersMatchedAgainstVisits[0].allocationOptions = allocationOptions;
        butlersMatchedAgainstVisits[0].visit = {}
        butlersMatchedAgainstVisits[0].butlersLeftOutOfThisVisit = []
        butlersMatchedAgainstVisits[0].butlersWantingThisVisit = []
        return butlersMatchedAgainstVisits;
      }

      if (butlersMatchedAgainstVisits[0]){
        butlersMatchedAgainstVisits[0].visitsUnableToAllocateDueToSettings = listOfVisitsUnableToAllocateDueToSettings
        butlersMatchedAgainstVisits[0].allocationOptions = allocationOptions;
        return butlersMatchedAgainstVisits;
      }
    
  }

  async attachVisitPlans(butlersMatchedAgainstVisits){
    const visitPlansIds = butlersMatchedAgainstVisits.map(result => result.visit.visitPlanId);
    const visitPlans = await this.knex
      .select('id','dateRange','timeWindow', 'duration', 'recurrence', 'hourlyRateOverride')
      .from('visitPlans')
      .whereIn('id', visitPlansIds);

    // make searching
    const visitPlansHashMap = new Map();
    for (const plan of visitPlans) {
      visitPlansHashMap.set(plan.id, plan);
    }

    // set visitPlan value
    for (const item of butlersMatchedAgainstVisits) {
      item.visit.visitPlan = visitPlansHashMap.get(item.visit.visitPlanId);
    }
  }

  // eslint-disable-next-line no-unused-vars
  async update(id, data, params) { // this is the logic to grant visits
    const visitsMatchedAgainstButlers = await this.app.service('managedSchedule').find(data);
    const modifierId = params && params.user && params.user.id
    const modifierDetailResp = modifierId ? await this.app.service('operators').find({id: modifierId}) : [];
    const modifierDetail = modifierDetailResp.length ? modifierDetailResp[0] : {};
    const { firstName, lastName, email } = modifierDetail;
    const modifierName = email ? `${firstName || ''} ${lastName || ''}(${email})` : 'N/A';

    //log before we start
    await this.knex('allocationLogs')
      .insert({
        allocatedButlersJsonData: JSON.stringify(visitsMatchedAgainstButlers),
        executionDate: LocalDate.now().toString(),
        dateTimeAllocationExecuted: (new Date().toISOString()).slice(0, 19).replace('T', ' ')
      });

    //then allocate
    for (const vmab of visitsMatchedAgainstButlers) {
      const butlerWhoGetsVisit = vmab.butlersWantingThisVisit.find(x => x.getsVisit);
      //give the visit to this butler
      if (butlerWhoGetsVisit && butlerWhoGetsVisit.id) {

        await this.knex('serviceButlers')
          .where('serviceId', vmab.visit.service.id)
          .where('activeFrom', vmab.visit.startDate.toString())
          .del();//delete all butlers on the visit date to be overriden in the next line

        //not sure we need this ?
        // await this.knex('serviceButlers')  // assign new butler for all recurrences of this service where old butler is to be replaced
        //   .where('serviceId', vmab.visit.service.id)
        //   .where('butlerId', vmab.visit.butlerId)
        //   .update({
        //     butlerId: butlerWhoGetsVisit.id
        //   });
        let butlerAllocatedByMethod= 'managedschedulesystem';
        if (vmab.visit.butlersWhoRequestedThisVisit && vmab.visit.butlersWhoRequestedThisVisit.indexOf(butlerWhoGetsVisit.id) > -1) {
           butlerAllocatedByMethod='butlerrequestedthisvisit';
        }
        await this.knex('serviceButlers')
          .insert({
            serviceId: vmab.visit.service.id,
            butlerId: butlerWhoGetsVisit.id,
            butlerAllocatedByMethod:butlerAllocatedByMethod,
            activeFrom: vmab.visit.startDate.toString(),
            dateTimeCreated: moment(new Date).format('YYYY-MM-DD hh:mm:ss'),
            lastModifiedBy: (modifierName + ' - Ran Allocations System')
          });

        await this.knex('requestedVisits').where('visitPlanId', vmab.visit.visitPlanId).update({
          processed: true
        });  //add new butler to the serviceButlers


      } else {
        console.log(butlerWhoGetsVisit);
      }
    }

    return await grantVisitsFromManagedScheduleList(this.app);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


