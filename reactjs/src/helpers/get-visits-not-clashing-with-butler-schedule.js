// const { LocalDateTime, DateTimeFormatter } = require('js-joda');

// require('js-joda-timezone');

// const calculateVisitEndDateTime = require('./calculate-visit-end-date-time');


// module.exports = async (allocationVisits, app, butler, startDate, endDate) => {
//   const butlerVisits = await app
//     .service('schedules')
//     .find({
//       query: {
//         startDate,
//         endDate
//       }
//     });

//   const mergedAllocationVisits = allocationVisits.map(x => x.anchoredVisits.map(z => z));
//   const flattenedAllocationVisits = [].concat.apply([], mergedAllocationVisits);

//   const mergedButlerVisits = butlerVisits.map(x => x.anchoredVisits.map(z => z));
//   const flattenedButlerVisits = [].concat.apply([], mergedButlerVisits);
//   const flattenedAndTransformedButlerVisits = flattenedButlerVisits.map(x => getTimeIntervalsForVisits(x));


//   const getTimeIntervalsForVisit = (visit) => {
//     const visitStartDateTime = LocalDateTime.parse(visit.date + ' ' + visit.startTime, DateTimeFormatter.forPattern('yyyy-MM-dd HH:mm'));
//     const endDateTime = calculateVisitEndDateTime(visitStartDateTime, visit.duration);
//     const visitEndDateTime = LocalDateTime.parse(endDateTime, DateTimeFormatter.forPattern('yyyy-MM-dd HH:mm'));

//     return {
//       visitStartDateTime: new Date(visitStartDateTime.toString()),
//       visitEndDateTime: new Date(visitEndDateTime.toString())
//     };
//   }


//   const getNonClashingVisits = (visit) => {
//     const timeInterval = getTimeIntervalsForVisit(visit);

//     let nonClashingVisit = true;
//     flattenedAndTransformedButlerVisits.every(o => {
//       const timeIntervalButlerVisit = getTimeIntervalsForVisit(o);
//       //(StartDate1 <= EndDate2) and (StartDate2 <= EndDate1)
//       if (timeInterval.visitStartDateTime <= timeIntervalButlerVisit.visitEndDateTime &&
//         timeIntervalButlerVisit.visitStartDateTime <= timeInterval.visitEndDateTime) {
//         visitClashes = false;
//         return visitClashes; // return false and break loop 
//       }
//     });
//     return nonClashingVisit;
//   }

//   const nonClashingVisits = flattenedAllocationVisits.filter(getNonClashingVisits)

//   return nonClashingVisits;

// }

