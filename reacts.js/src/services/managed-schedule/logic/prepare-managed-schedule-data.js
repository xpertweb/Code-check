const { LocalDate } = require('js-joda');
const transformAllocationsIntoSchedule = require('../../../helpers/transform-allocations-into-schedule');
const calculateValueForClients = require('../../../helpers/calculate-value-for-clients');
const getWantedVisits = (butler, visitsRequestedByButlers, transformedAllocations) => {

  const butlerVisits = visitsRequestedByButlers.filter(z => z.butlerId == butler.butler.id);
  const wantedVisits = transformedAllocations.filter(x => butlerVisits.find(y => y.visitPlanId == x.visitPlanId));

  return wantedVisits;
};

const COMMITMENT_PERIOD_ENUM_VALUES = {
  cannotcommit: 0,
  lessthanonemonth: 1,
  morethanonemonth: 2,
  morethanthreemonths: 3,
  morethansixmonths: 4,
  morethanoneyear: 5
};

module.exports = async (app, startDate, endDate, allocationOptions, getNotEnrolledButlers, getFrozenButlers,takeNotRealRequestsOnly) => {
  const {commitmentPeriodThresholdSetting} = allocationOptions;
  const rankedButlersList = await app.service('rankedButlers').find({
    query: {
      disqualifyingButlerRating: allocationOptions.disqualifyingButlerRating,
      getNotEnrolledButlers: getNotEnrolledButlers,
      getFrozenButlers: getFrozenButlers,
      takeNotRealRequestsOnly: takeNotRealRequestsOnly
    }
  });

  const allocatableVisits = await app.service('allocations').find({
    query: {
      startDate,
      endDate,
    }
  });


  let transformedAllocations = transformAllocationsIntoSchedule(allocatableVisits);
  const servicesOfAllocatableVisits = await app.service('services').find({
    query: {
      id: {
        $in: transformedAllocations.map(x => x.serviceId)
      }
    }
  });


  const serviceChurnRisks = await app.service('serviceChurnRisks').find({
    query: {
      serviceId: {
        $in: servicesOfAllocatableVisits.map(x => x.id)
      }
    }
  });

  

  for (const allocation of transformedAllocations) {
    allocation.serviceChurnRisk = serviceChurnRisks.find(x => x.serviceId == allocation.serviceId);
    allocation.service = servicesOfAllocatableVisits.find(x => x.id == allocation.serviceId);
  }

  let serviceIds = transformedAllocations.map(x=> x.service.id);
  const clientsVisitPlans = await app.service('visitPlans').find({
    query: {
      serviceId : {
        $in : serviceIds
      }
    }
  });

  

  const commitmentPeriodsToAllow = [
    'cannotcommit',
    'lessthanonemonth',
    'morethanonemonth',
    'morethanthreemonths',
    'morethansixmonths',
    'morethanoneyear'].filter((o,i) => {
    const numericValue = COMMITMENT_PERIOD_ENUM_VALUES[commitmentPeriodThresholdSetting];
    if (numericValue != undefined && i >= numericValue){
      return true;
    } else {
      return false;
    }
  });

  let visitsRequestedByButlers = []
  if(takeNotRealRequestsOnly){
    visitsRequestedByButlers = await app.service('requestedVisits').find({
      query: {
        butlerId: {
          $in: rankedButlersList.map(x => x.butler.id)
        },
        periodWillingToCommit: {
          $in: commitmentPeriodsToAllow
        },
        dateTimeRequestCreated: {
          $gte: LocalDate.now().minusWeeks(2).toString(), //proces two weeks old data maximum, nothing older
        },
        $or:[
          {preferredVisitTime : {
            $ne : null
          }},
          {alternativeVisitPlanDateAndTimeSelected: true}
        ]
      }
    });
  }else{
    visitsRequestedByButlers = await app.service('requestedVisits').find({
      query: {
        butlerId: {
          $in: rankedButlersList.map(x => x.butler.id)
        },
        periodWillingToCommit: {
          $in: commitmentPeriodsToAllow
        },
        dateTimeRequestCreated: {
          $gte: LocalDate.now().minusWeeks(2).toString(), //proces two weeks old data maximum, nothing older
        },
        preferredVisitTime : null,
        alternativeVisitPlanDateAndTimeSelected: null
      }
    });
  }

  const clientValueSettings = (await app.service('clientValueSettings').find())[0];
  //sort visits in terms of client quality
  for (const allocation of transformedAllocations) {
    const visitPlansWithServicesBelongingToClient = clientsVisitPlans.filter(x=> x.serviceId == allocation.service.id);
    const clientVisitPlans = clientsVisitPlans.filter(x=> visitPlansWithServicesBelongingToClient.find(z=> z.serviceId == x.serviceId));
    const clientServices = transformedAllocations.filter(x=> x.service.clientId == allocation.service.clientId).map(x => x.service);
    
    const serviceChurns = transformedAllocations.filter(x=> clientServices.find(z=> z.id == (x.serviceChurnRisk || {}).serviceId));
    let clientServiceChurnRisks = serviceChurns ? serviceChurns.map(x => x.serviceChurnRisk) : null;
    
    
    const sortedPlans = clientVisitPlans.sort((a,b)=> new Date(a.startDate.toString()) - new Date(b.startDate.toString()));
    const clientFirstVisitDate = sortedPlans[0].startDate;
    allocation.service.client.clientValue = calculateValueForClients(clientValueSettings,clientVisitPlans,clientFirstVisitDate, clientServices,clientServiceChurnRisks);
  }

  transformedAllocations.sort((allocationA, allocationB) => {
    return allocationB.service.client.clientValue -
    allocationA.service.client.clientValue;
  });

  // let managedScheduleButlers = rankedButlersList.filter(x => x.butler.managedSchedule);
  const managedScheduleButlers = rankedButlersList.filter(x => x.butler.managedSchedule).map(x => {
    let wantedVisits = getWantedVisits(x, visitsRequestedByButlers, transformedAllocations);
    wantedVisits.sort((visitA, visitB) => {
      return visitB.service.client.clientValue -
      visitA.service.client.clientValue;
    });
    return Object.assign({}, x,
      {
        wantedVisits: wantedVisits
      });
  });

  const nonManagedScheduleButlers = rankedButlersList.filter(x => !x.butler.managedSchedule);

  const filledNonManagedButers = nonManagedScheduleButlers.map(o => {
    let wantedVisits = getWantedVisits(o, visitsRequestedByButlers, transformedAllocations);
    wantedVisits.sort((visitA, visitB) => {
      return visitB.service.client.clientValue -
      visitA.service.client.clientValue;
    });
    return {
      butler: o.butler,
      wantedVisits: wantedVisits
    };
  });



  // "id": "1e89b14c-833c-11e9-8f9e-67d59032f17b",
  //       "butlerId": "4a707bd2-8338-11e9-93c5-7f51bfe17a31",
  //       "reason": null,
  //       "startDate": "2019-05-30",
  //       "endDate": "2019-07-10"

  const pausesForAllButlers = await app.service('butlerPauses').find({query:{
    butlerId: {
      $in: rankedButlersList.map(x => x.butler.id)
    }
  }});



  return {
    pausesForAllButlers,
    managedScheduleButlerVisits: transformedAllocations,
    managedScheduleButlers,
    nonManagedScheduleButlers: filledNonManagedButers,
    visitsRequestedByButlers
  };


};
