const getWorkDayFor = require('../../../helpers/get-work-day-for');
const { generateSchedule } = require('../../schedules/jsch');
const getMaxDistanceBetweenVisits = require('../../../helpers/get-max-distance-between-visits');
const { LocalDate } = require('js-joda');
const distanceBetweenGeoPoints = require('../../../helpers/distance-between-geo-points');

module.exports = async (visit, butler, dataResults, butlerRequestedThisVisit = false, startDateRequested, allocationOptions, managedResults = [], churnPerClientSettings, requestedVisitData,requestedVisitDataFull, pausesForAllButlers) => {
  const { daysFromNowToTakeOnlyRequestedVisits,
    disqualifyingNumberOfVisits,
    maxAllocationsForButlerPerRun } = allocationOptions;
  let firstCondition = false; // less than 3 visits on that day
  let secondCondition = butlerRequestedThisVisit; // butler works on that day
  let thirdCondition = false;  // overlaps in the schedule
  let fourthCondition = false; // gender pref
  let fifthCondition = false; // pets filter
  let sixthCondition = butlerRequestedThisVisit; // travel distance
  let seventhCondition = false; //address
  let eighthCondition = false; // exclusion date for visits
  let ninthCondition = false; // max allocations limit reached for this butler
  let tenthCondition = false; // butler churn per client (cpc) rating is below threshold
  let eleventhCondition = false; // butler is not paused during the period of the visit
  let twelvethCondition = false; // equipment (spray and wipes)
  let thirteenthCondition = false; // equipment (vacuum)
  let fourteenthCondition = false; // equipment (mop)
  let fifteenthCondition = false; //equipment (desinfectant)
  let sixteenthCondition = false; //equipment (steam cleaner)
  let seventeenthCondition = false; // equipment (drycleaning)
  let eighteenthCondition = false; // equipment (end of lease cleaning)
  let nineteenthCondition = false; // equipment (furniture assembly )
  let twentiethCondition = false; // equipment (packing)
  let twentyOneCondition = false; // equipment (gardening)

  const exclusionDate = LocalDate.parse(startDateRequested).plusDays(daysFromNowToTakeOnlyRequestedVisits).toString();
  //if today current day its exclusion day and the butler didnt request that visit, skip butler

  let previouslyIteratedButler = {};

  if (butler.churnsPerClientRating != null && butler.churnsPerClientRating != undefined) {
    if (butler.churnsPerClientRating < churnPerClientSettings.disqualifyingChurnPerClientRating) {
      tenthCondition = true;
    }
  } else { // if it doesnt exist its because this butler hasnt churned anyone
    tenthCondition = true;
    butler.churnsPerClientRating = 0;
  }


  if (visit.service.disinfectantRequired == true){
    if (butler.disinfectantProvided == true) {
      fifteenthCondition = true;
    }
  } else {
    fifteenthCondition = true;
  }

  if (visit.service.steamCleanerRequired == true){
    if (butler.steamCleanerProvided == true) {
      sixteenthCondition = true;
    }
  } else {
    sixteenthCondition = true;
  }

  if (visit.service.carpetDryCleaningRequired == true){
    if (butler.carpetDryCleaningProvided == true) {
      seventeenthCondition = true;
    }
  } else {
    seventeenthCondition = true;
  }


  if (butler.spraysWipesAndBasicsProvided != null){

    if (butler.spraysWipesAndBasicsProvided == visit.service.spraysWipesAndBasicsRequired){
      twelvethCondition = true;
    } else if (butler.spraysWipesAndBasicsProvided == true){
      twelvethCondition = true;
    }
  } else {
    twelvethCondition = true;
  }
  if (!visit.service.spraysWipesAndBasicsRequired){
    twelvethCondition = true;
  }

  if (butler.vacuumProvided != null){
    if (butler.vacuumProvided == visit.service.vacuumRequired){
      thirteenthCondition = true;
    } else if (butler.vacuumProvided == true){
      thirteenthCondition = true;
    }
  } else {
    thirteenthCondition = true;
  }
  if (!visit.service.vacuumRequired){
    thirteenthCondition = true;
  }

  if (butler.mopProvided != null){
    if (butler.mopProvided == visit.service.mopRequired){
      fourteenthCondition = true;
    } else if (butler.mopProvided == true){
      fourteenthCondition = true;
    }
  } else {
    fourteenthCondition = true;
  }
  if (!visit.service.mopRequired){
    fourteenthCondition = true;
  }


  if (visit.service.furnitureAssemblyRequired == true){
    if (butler.furnitureAssemblyProvided == true) {
      nineteenthCondition = true;
    }
  } else {
    nineteenthCondition = true;
  }


  if (visit.service.endOfLeaseRequired == true){
    if (butler.mopProvided == true && butler.vacuumProvided == true) {
      eighteenthCondition = true;
    }
  } else {
    eighteenthCondition = true;
  }

  if (visit.service.packingServiceRequired == true){
    if (butler.packingServiceProvided == true) {
      twentiethCondition = true;
    }
  } else {
    twentiethCondition = true;
  }

  if (visit.service.gardeningServiceRequired == true){
    if (butler.gardeningServiceProvided == true) {
      twentyOneCondition = true;
    }
  } else {
    twentyOneCondition = true;
  }



  if (managedResults.length > 0) {
    managedResults.forEach(x => {
      previouslyIteratedButler = x.butlersWantingThisVisit.find(y => y.id == butler.id) || {};
    });
  }

  if (!previouslyIteratedButler.id) {
    previouslyIteratedButler = butler;
  }

  ninthCondition = true;
  // if ((previouslyIteratedButler.allocatedVisits || 0) < maxAllocationsForButlerPerRun){
  //   ninthCondition = true;
  // } else {
  //   return;
  // }

  // retry



  const butlerPauses = pausesForAllButlers.filter(x => x.butlerId == butler.id);
  for (const pause of butlerPauses) {
    if ((new Date(visit.startDate) >= new Date(pause.startDate) //if visit is bigger than pause date
    && (!pause.endDate || new Date(visit.startDate) <= new Date(pause.endDate)))  // if pause date doesnt exist, or of pause date is bigger than visit date
    || new Date(pause.startDate) >= new Date(LocalDate.now().toString()) // or if the pause date is bigger than today (upcoming pause)
    ) {
      return [false, ['butler is paused during the time of visit']];
    } else {
      eleventhCondition = true;
    }
  }
  if (butlerPauses.length == 0) {
    eleventhCondition = true;
  }

  if (exclusionDate == visit.startDate.toString() && !butlerRequestedThisVisit) {
    return [false, ['today current day its exclusion day and the butler didnt request that visit, skip butler']];
    ;
  } else {
    eighthCondition = true;
  }

  if (visit.service.address.state == butler.address.state) {
    seventhCondition = true;
  }

  if (!butler.address.geopoint) { // if the butler doesnt have an address we cant calculate the schedule
    return [false, ['butler does not have address']];
  }


  if (visit.service.genderPref == butler.gender || visit.service.genderPref == 'n') { // gender filter
    fourthCondition = true;
  } else {
    return [false, ['gender requirement is not satisfied']];
  }

  if (!butler.handlesPets) { //pets filter
    if (visit.service.pets == false) {
      fifthCondition = true;
    } else {
      return [false, ['butler cannot handle pets']];
    }
  } else {
    fifthCondition = true;
  }

  //check butler visits for this day
  const visitsForButlerOnAllocationDay = dataResults[0]
    .filter(x => x.butlerId == butler.id)
    .filter(x => x.date.toString() == visit.startDate.toString());
  //we do not allocate visits to butlers with more than 3 visits on allocation visit date
  if (visitsForButlerOnAllocationDay.length <= disqualifyingNumberOfVisits) {
    firstCondition = true;
  } else {
    return [false, ['butler already has visits for the same day']];
  }

  // If Assigning a Visit will cause any errors in their schedule disqualify them against that Visit. (An exception exists here where if a Butler has Requested this Visit, you should not consider any errors caused solely by Butler Availabilities)
  const workDays = dataResults[1].filter(x => x.butlerId == butler.id);
  let workDay = getWorkDayFor(butler.id, visit.startDate, workDays);
  if (workDay || secondCondition) { //if there is a workday its same as butlerAvailable being true


    if (secondCondition){
      let fakeWorkDay = {
        date: LocalDate.parse(visit.startDate.toString()),
        windowStartTime: '01:00:00',
        windowEndTime: '23:30:00',
      };
      workDay = Object.assign({},workDay,fakeWorkDay);
      butler.fakeWorkDayToAddIntoSchedule = workDay;
    }
    secondCondition = true;
    let newSetOfVisits = [...visitsForButlerOnAllocationDay, visit];

    if (previouslyIteratedButler.alreadyAllocatedVisits) {
      newSetOfVisits = newSetOfVisits.concat(previouslyIteratedButler.alreadyAllocatedVisits.filter(x => x.startDate.toString() == visit.startDate));
    }

    const maxDistance = getMaxDistanceBetweenVisits(
      [...newSetOfVisits, {
        geopoint: {
          lat: butler.address.geopoint.y,
          lng: butler.address.geopoint.x,
        }
      }]);

    if ((butler.maxTravelDistance / 1000) > maxDistance || sixthCondition) {
      sixthCondition = true;
      let distance = distanceBetweenGeoPoints(butler.address.geopoint.y,butler.address.geopoint.x,visit.geopoint.lat,visit.geopoint.lng);
      butler.distanceToVisit = distance;
    } else {
      return [false, ['butler cannot travel that far']];
    }
    const generatedSchedule = await generateSchedule(
      newSetOfVisits,
      workDay,
      butler.hasCar
    );

    if (generatedSchedule.constraintsSatisfied && !generateSchedule.trunc) {
      thirdCondition = true;
    } else {
      return [false, ['unable to generate schedule']];
    }
  }

  const rejectionReasons = getRejectionReasons({
    firstCondition,
    secondCondition,
    thirdCondition,
    fourthCondition,
    fifthCondition,
    sixthCondition,
    seventhCondition,
    eighthCondition,
    ninthCondition,
    tenthCondition,
    eleventhCondition,
    twelvethCondition,
    thirteenthCondition,
    fourteenthCondition,
    fifteenthCondition,
    sixteenthCondition,
    seventeenthCondition,
    eighteenthCondition,
    nineteenthCondition,
    twentiethCondition,
    twentyOneCondition,
  });

  if (firstCondition && secondCondition && thirdCondition && fourthCondition && fifthCondition && sixthCondition && seventhCondition && eighthCondition && ninthCondition && tenthCondition && eleventhCondition && twelvethCondition && thirteenthCondition && fourteenthCondition && fifteenthCondition && sixteenthCondition && seventeenthCondition && eighteenthCondition && nineteenthCondition && twentiethCondition) {
    previouslyIteratedButler.allocatedVisits = (previouslyIteratedButler.allocatedVisits || 0) + 1;

    if (!previouslyIteratedButler.alreadyAllocatedVisits) {
      previouslyIteratedButler.alreadyAllocatedVisits = [visit];
    } else {
      previouslyIteratedButler.alreadyAllocatedVisits.push(visit);
    }



    if (butlerRequestedThisVisit) {
      visit.requestedVisitData = requestedVisitData;
      if (!visit.butlersWhoRequestedThisVisit) {
        visit.butlersWhoRequestedThisVisit = [butler.id];
        visit.butlersPreferredVisitTime = [requestedVisitDataFull.find(x=>x.butlerId  == butler.id)];
      } else {
        visit.butlersWhoRequestedThisVisit.push(butler.id);
        visit.butlersPreferredVisitTime.push(requestedVisitDataFull.find(x=>x.butlerId  == butler.id));
      }
    }
    return [true, rejectionReasons];
  } else {
    return [false, rejectionReasons];
  }
};


const REAONS_FOR_REJECTION = {
  firstCondition: 'less than 3 visits on that day',
  secondCondition: 'butler works on that day',
  thirdCondition: ' overlaps in the schedule',
  fourthCondition: 'gender requirement not satisfied',
  fifthCondition: 'butler cannot handle pet',
  sixthCondition: 'travel distance limit reached',
  seventhCondition: 'address state is different',
  eighthCondition: 'exclusion date requirement not satisfied',
  ninthCondition: 'max allocations limit reached for this butler',
  tenthCondition: 'butler churn per client (cpc) rating is below threshold',
  eleventhCondition: 'butler is paused or will be paused during visit\'s time',
  twelvethCondition: 'sprays wipes and basics service is not provided by the butler',
  thirteenthCondition: 'vacuum is not provided by the butler',
  fourteenthCondition: 'mop is not provided by the butler',
  fifteenthCondition: 'disinfectant is not provided by the butler.',
  sixteenthCondition: 'steam cleaner is not provided by the butler.',
  seventeenthCondition: 'carpet dry cleaning is not provided by the butler.',
  eighteenthCondition: 'end of lease service is not provided by the butler',
  nineteenthCondition: 'furniture assembly service is not provided by the butler',
  twentiethCondition: 'packing service is not provided by the butler',
  twentyOneCondition: 'gardening is not provided by the butler',
};

function getRejectionReasons(checks){
  const reasons = [];
  for (const [key, value] of Object.entries(checks)) {
    if (!value){
      reasons.push(REAONS_FOR_REJECTION[key]);
    }
  }
  return reasons;
}
