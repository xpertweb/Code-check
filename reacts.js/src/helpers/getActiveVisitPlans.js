const { LocalDate, Period } = require('js-joda');
const weeksBetween = require('./weeks-between');
const RECURRENCE_ENUM  = require('./enum/recurrence-enum');

require('js-joda-timezone');


module.exports = function (visitPlans, nextDate) {



  let clearPlans = [];

  //get all the pauses for all the services of these visit plans 
  
  visitPlans.forEach((vp) => {

    if (vp.recurrence !== RECURRENCE_ENUM.OneOff) {
      if (vp.endDate && LocalDate.parse(vp.endDate).isBefore(nextDate)) { //this means it is an expired plan
        return;
      }
    }

    
    const weeksSincePlanStarted = weeksBetween(new Date(vp.startDate), new Date(nextDate.toString()));


    // the future plan could be paused, if it is paused then take another future plan

    
    switch (vp.recurrence) {
    case RECURRENCE_ENUM.Weekly:
      clearPlans.push({
        startDate: LocalDate.parse(vp.startDate).plus(Period.ofWeeks(weeksSincePlanStarted + 1)),
        id: vp.id,
        serviceId: vp.serviceId,
        recurrence: vp.recurrence,
        hourlyRateOverride: vp.hourlyRateOverride,
        comment: vp.comment,
        endDate: vp.endDate,
        windowStartTime: vp.windowStartTime,
        windowEndTime: vp.windowEndTime,
        duration: vp.duration,
      });
      break;
    case RECURRENCE_ENUM.Fortnightly: {
      const weeksExtra = weeksSincePlanStarted % 2 > 0 ? 1 : 2;
      clearPlans.push({
        id: vp.id,
        serviceId: vp.serviceId,
        recurrence: vp.recurrence,
        hourlyRateOverride: vp.hourlyRateOverride,
        comment: vp.comment,
        endDate: vp.endDate,
        windowStartTime: vp.windowStartTime,
        windowEndTime: vp.windowEndTime,
        duration: vp.duration,
        startDate: LocalDate.parse(vp.startDate).plus(Period.ofWeeks(weeksSincePlanStarted + weeksExtra)),

      });
      break;
    }
    case RECURRENCE_ENUM.OneOff:
      clearPlans.push({
        id: vp.id,
        serviceId: vp.serviceId,
        recurrence: vp.recurrence,
        hourlyRateOverride: vp.hourlyRateOverride,
        comment: vp.comment,
        endDate: vp.endDate,
        windowStartTime: vp.windowStartTime,
        windowEndTime: vp.windowEndTime,
        duration: vp.duration,
        startDate: LocalDate.parse(vp.startDate),
      });
      break;
    default:
      break;
    }
  });

  return clearPlans
    .filter(x => x.startDate.isAfter(nextDate));
};
