const { LocalDate } = require('js-joda');
const RECURRENCE_ENUM = require('./enum/recurrence-enum');

const getDaysBetweenDates = (first, second)=> {
  return Math.round((new Date(first) - new Date(second))/(1000*60*60*24));
};


module.exports = (clientValueSettings, clientVisitPlans, clientFirstVisitDate, clientServices,clientServiceChurnRisks) => {

  const { futureWeeklyVisitPlansMultiplier,
    futureFortnightlyVisitPlansMultiplier,
    futureOnceOffVisitPlansMultiplier,
    daysOfClientLoyaltyMultiplier,
    spraysWipesAndBasicsAddedPoints,
    whizzServicesPoints,
    vacuumAndMopAddedPoints,
    thirdPartyJobReducedPoints,
    churnRiskMultiplier
  } = clientValueSettings;

  const thirdPartyService = clientServices.filter(x=> x.isThirdPartyJob).length > 0;
  const requiresVacuum = clientServices.filter(x=> x.vacuumRequired).length > 0;
  const requiresMop = clientServices.filter(x=> x.mopRequired).length > 0;

  const clientHasWhizzServices = clientServices.filter(x=> x.isWhizzClient).length > 0;
  const requiresWipesAndBasics = clientServices.filter(x=> x.spraysWipesAndBasicsRequired).length > 0;

  const activeClientVisitPlans = clientVisitPlans.filter(x => {
    return !x.endDate || LocalDate.parse(x.endDate).isAfter(LocalDate.now());
  });

  //const sortedActiveVisitPlans = activeClientVisitPlans.sort((a,b)=> new Date(b.startDate.toString()) - new Date(a.startDate.toString()));
  let activeFutureWeeklyVisitPlans = activeClientVisitPlans.filter(x=> x.recurrence == RECURRENCE_ENUM.Weekly).length;
  let activeFutureFortnightlyVisitPlans = activeClientVisitPlans.filter(x=> x.recurrence == RECURRENCE_ENUM.Fortnightly).length;
  let activeFutureOnceOffVisitplans = activeClientVisitPlans.filter(x=> x.recurrence == RECURRENCE_ENUM.OneOff).length;
  //let clientNextVisitDate = sortedActiveVisitPlans[0].startDate;
  const daysOfServiceWithClient = getDaysBetweenDates(LocalDate.now().toString(),clientFirstVisitDate.toString());

  let totalChurnRiskValue = 0;
  if (clientServiceChurnRisks){
    totalChurnRiskValue = clientServiceChurnRisks.reduce((previous,current) =>{
      return parseFloat(current.riskRating) + previous;
    },0)
  }
  let clientScore = (parseFloat(futureWeeklyVisitPlansMultiplier) * parseInt(activeFutureWeeklyVisitPlans)) + 
                      (parseFloat(futureFortnightlyVisitPlansMultiplier) * parseInt(activeFutureFortnightlyVisitPlans)) + 
                      (parseFloat(futureOnceOffVisitPlansMultiplier) * parseInt(activeFutureOnceOffVisitplans)) + 
                      (parseFloat(daysOfClientLoyaltyMultiplier) * parseInt(daysOfServiceWithClient)) +  
                      (parseFloat(churnRiskMultiplier) * parseInt(totalChurnRiskValue));

  if (requiresVacuum){
    clientScore += (parseFloat(vacuumAndMopAddedPoints));
  }
  if (requiresMop){
    clientScore += (parseFloat(vacuumAndMopAddedPoints));
  }
  if (requiresWipesAndBasics){
    clientScore += (parseFloat(spraysWipesAndBasicsAddedPoints));
  }
  if (clientHasWhizzServices){
    clientScore += (parseFloat(whizzServicesPoints));
  }

  if (thirdPartyService){
    clientScore -= (parseFloat(thirdPartyJobReducedPoints));
  }
  
  return clientScore;
};

