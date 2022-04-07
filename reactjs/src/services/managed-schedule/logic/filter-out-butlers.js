
const filterOutNonManagedButlers = require('./filter-out-non-managed-butlers');
const filterOutManagedButlers = require('./filter-out-managed-butlers');

module.exports = async (app, managedButlers, managedScheduleButlerVisits, nonManagedScheduleButlers, startDate, allocationOptions, churnPerClientSettings, visitsRequestedByButlers, pausesForAllButlers) => {
  //process managed butlers
  let mergedResults = [];
  let nonManagedResults = [];
  let managedResults = [];

  if (managedScheduleButlerVisits.length > 0) {
    managedResults = await filterOutManagedButlers(app, managedScheduleButlerVisits, managedButlers, startDate, allocationOptions,churnPerClientSettings, visitsRequestedByButlers, pausesForAllButlers);
  }

  const allVisits = [].concat.apply([], nonManagedScheduleButlers.map(x => x.wantedVisits));


  if (allVisits.length > 0) {
    nonManagedResults = await filterOutNonManagedButlers(app, nonManagedScheduleButlers, startDate, allocationOptions, managedResults, churnPerClientSettings, visitsRequestedByButlers, pausesForAllButlers);
  }


  //last step - merge both lists
  mergedResults = [].concat.apply( nonManagedResults , managedResults);


  return mergedResults;
};
