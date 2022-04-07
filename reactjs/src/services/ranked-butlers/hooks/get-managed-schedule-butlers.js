const mergeAndDedupe = require('../../../helpers/merge-and-dedupe');
const _ = require('lodash');
const { LocalDate } = require('js-joda');

module.exports = function () {
  // eslint-disable-line no-unused-vars
  return async function getUnallocatedButler(hook) {
    const {disqualifyingButlerRating, getNotEnrolledButlers,getFrozenButlers,takeNotRealRequestsOnly} = (hook.params.query || {});
    
    let requestedVisitButlers = []
    let managedScheduleButlers = []
    let requestedVisits = [];
    if (takeNotRealRequestsOnly){ //requests that are not "real" are those for which the butler selected alternate pay/visit time/date ,etc

      requestedVisits = await hook.app
      .service('requestedVisits')
      .find({
        query : {
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

      //get all butlers who requested a visit
      requestedVisitButlers = await hook.app
      .service('butlers')
      .find({
        query: {
          id: {
            $in: _.uniq(requestedVisits.map(x => x.butlerId))
          },
          rating: {
            $gte: (disqualifyingButlerRating || 3.5)
          },
          // onFreeze : (getFrozenButlers ? true : (getNotEnrolledButlers ? true : false)) ,
          // verified: (getFrozenButlers ? true : (getNotEnrolledButlers ? false : true)) 
        }
      });

    } else { //these are "real" requests, those that the butler requested accepting existing time/pay/date of visit
      //get MSP butlers
      managedScheduleButlers = await hook.app
      .service('butlers')
      .find({
        query: {
          managedSchedule: true,
          rating: {
            $gte: (disqualifyingButlerRating || 3.5)
          },
          onFreeze : (getFrozenButlers ? true : (getNotEnrolledButlers ? true : false)) ,
          verified: (getFrozenButlers ? true : (getNotEnrolledButlers ? false : true)) 
        }
      });

      requestedVisits = await hook.app
      .service('requestedVisits')
      .find({
        query : {
          dateTimeRequestCreated: {
            $gte: LocalDate.now().minusWeeks(2).toString(), //proces two weeks old data maximum, nothing older
          },
          // payExpectedToBeReceivedFromVisit: null,
          preferredVisitTime : null,
          alternativeVisitPlanDateAndTimeSelected : null
        }
      });

      //get all butlers who requested a visit
      requestedVisitButlers = await hook.app
      .service('butlers')
      .find({
        query: {
          id: {
            $in: _.uniq(requestedVisits.map(x => x.butlerId))
          },
          rating: {
            $gte: (disqualifyingButlerRating || 3.5)
          },
          onFreeze : (getFrozenButlers ? true : (getNotEnrolledButlers ? true : false)) ,
          verified: (getFrozenButlers ? true : (getNotEnrolledButlers ? false : true)) 
        }
      });
    }
    

    const foundDebugButler = requestedVisitButlers.find(x=> x.lastName == 'Address3');
    if (foundDebugButler){
      console.log(foundDebugButler);
    } else {
      // console.log('not found :(')
    }
    
    hook.params.allRequestedVisits = requestedVisits;
    
    hook.params.butlersNeedingManagement = mergeAndDedupe(requestedVisitButlers,managedScheduleButlers,'id');
    return hook;
  };
};
