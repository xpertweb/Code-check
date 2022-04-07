const WantedVisitModel = require('./wanted-visit-model');
const getFilterOutData = require('./get-filter-out-data');
const filterOutConditions = require('./get-filter-conditions');

const logger = require('winston');


module.exports = async (app, managedScheduleButlerVisits, managedButlers, startDate, allocationOptions,churnPerClientSettings, visitsRequestedByButlers, pausesForAllButlers) => {
  let butler;
  let dataResults = [];
  let results = [];
  //GET DATA

  const sortedButlerVisits = managedScheduleButlerVisits.sort((a, b) => {
    return new Date(a.startDate.toString()) - new Date(b.startDate.toString());
  });
  const earliestVisit = sortedButlerVisits[0];
  const lastVisit = sortedButlerVisits[sortedButlerVisits.length - 1];

  dataResults = await getFilterOutData(app,earliestVisit,lastVisit,managedButlers);

  // //USE DATA
  for (const visit of managedScheduleButlerVisits) {    //for each butler check if he/she can do that visit
    const butlersCompetingForThisVisit = [];
    const butlersLeftOutOfThisVisit = [];
    for (const mb of managedButlers) {
      butler = mb.butler;

      if (butler.lastName == 'Address3'){
        logger.info('FOUND_BUTLER_2');
        logger.info({
          managedScheduleButlerVisits,
          managedButlers,
           startDate,
           allocationOptions,
           churnPerClientSettings,
           visitsRequestedByButlers,
           pausesForAllButlers
        }, {tags: 'managed-schedule-data'});
        // logger.info('HEREEEEEEE',arguments);
      } else {
        // logger.info('not found :(');
        // console.log('not found :(');
      }

      let butlerRequestedThisVisit = false;
      let requestedVisitData;
      let requestedVisitDataFull;
      let requestedVisit = mb.wantedVisits.find(x=> x.visitPlanId == visit.visitPlanId);
      if (requestedVisit){
        requestedVisitData = visitsRequestedByButlers.find(x=> x.visitPlanId == requestedVisit.visitPlanId);
        requestedVisitDataFull = visitsRequestedByButlers.filter(x=> x.visitPlanId == visit.visitPlanId);
        butlerRequestedThisVisit = true;
      }

      // if (butler.email == 'fake-812520@email.com'){
      //   console.log('yes',visit.visitPlanId);
      //   if (visit.visitPlanId == 'ad630146-282b-11e9-8ac7-83d33bed4fa3'){
      //     console.log('passed check all good',butlerRequestedThisVisit);
      //   }
      // }

      const [passedAllConditions, rejectionReasons] = await filterOutConditions(visit,butler,dataResults,butlerRequestedThisVisit, startDate,allocationOptions,undefined,churnPerClientSettings,requestedVisitData,requestedVisitDataFull,pausesForAllButlers);
      delete butler.password;
      if (passedAllConditions) {
        butlersCompetingForThisVisit.push(butler);
      } else if (butlerRequestedThisVisit) {
        butlersLeftOutOfThisVisit.push({...butler, rejectionReasons});
      }
    }
    results = [...results, new WantedVisitModel({
      visit,
      butlersWantingThisVisit: butlersCompetingForThisVisit,
      butlersLeftOutOfThisVisit: butlersLeftOutOfThisVisit
    })];
  }
  return results;
};
