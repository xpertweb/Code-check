const WantedVisitModel = require('./wanted-visit-model');
const getFilterOutData = require('./get-filter-out-data');
const filterOutConditions = require('./get-filter-conditions');
const logger = require('winston');

module.exports = async (app, nonManagedScheduleButlers, startDate,allocationOptions, managedResults,churnPerClientSettings, visitsRequestedByButlers, pausesForAllButlers) => {
  let visit;
  let butler;
  let results = [];
  let dataResults = [];
  //GET DATA

  const allVisits = [].concat.apply([], nonManagedScheduleButlers.map(x => x.wantedVisits));
  const sortedButlerVisits = allVisits.sort((a, b) => {
    return new Date(a.startDate.toString()) - new Date(b.startDate.toString());
  });

  const earliestVisit = sortedButlerVisits[0];
  const lastVisit = sortedButlerVisits[sortedButlerVisits.length - 1];

  dataResults = await getFilterOutData(app,earliestVisit,lastVisit,nonManagedScheduleButlers);

  //USE DATA
  //process non managed butlers
  for (const nmb of nonManagedScheduleButlers) { //for each butler check if he/she can do that visit
    butler = nmb.butler;

    if (butler.lastName == 'Address3'){
      logger.info('FOUND_BUTLER');
      logger.info({
        nonManagedScheduleButlers,
        startDate,allocationOptions,
        managedResults,
        churnPerClientSettings,
        visitsRequestedByButlers,
        pausesForAllButlers
      }, {tags: 'none-managed-schedule-data'});
      // logger.info('HEREEEEEEE',arguments);
    } else {
      // logger.info('not found :(');
      // console.log('not found :(');
    }

    butler.processedVisitsList = [];
    butler.visitsThisButlerDidntMakeIt = [];

    for (visit of nmb.wantedVisits) {
      let butlerRequestedThisVisit = true; // butlers not in MSP already match against requested visits only
      let requestedVisitData = visitsRequestedByButlers.find(x=> x.visitPlanId == visit.visitPlanId);
      let requestedVisitDataFull = visitsRequestedByButlers.filter(x=> x.visitPlanId == visit.visitPlanId);
      const [passedAllConditions, ] = await filterOutConditions(visit,butler,dataResults,butlerRequestedThisVisit, startDate,allocationOptions, managedResults,churnPerClientSettings,requestedVisitData,requestedVisitDataFull,pausesForAllButlers);
      delete butler.password;
      if (passedAllConditions) {
        butler.processedVisitsList.push(visit);
      } else if (requestedVisitData){
        butler.visitsThisButlerDidntMakeIt.push(visit);
      }

    }
  }

  const allProcessedVisits = [].concat.apply([], nonManagedScheduleButlers.map(x => x.butler.processedVisitsList));
  for (visit of allProcessedVisits) {
    results = [...results, new WantedVisitModel({
      visit,
      butlersLeftOutOfThisVisit: nonManagedScheduleButlers.filter(x => x.butler.visitsThisButlerDidntMakeIt.find(z => z.visitPlanId == visit.visitPlanId && z.startDate.toString() == visit.startDate.toString())).map(x => x.butler),
      butlersWantingThisVisit: nonManagedScheduleButlers.filter(x => x.butler.processedVisitsList.find(z => z.visitPlanId == visit.visitPlanId && z.startDate.toString() == visit.startDate.toString())).map(x => x.butler)
    })];
  }

  return results;
};
