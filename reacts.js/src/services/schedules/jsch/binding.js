// const ffi = require('ffi');
// const ref = require('ref');
// const StructType = require('ref-struct');
// const ArrayType = require('ref-array');
// const { deserializeFloatTime, serializeFloatTime, travelHoursBetweenGeopoints, roundHoursToNearest5Min } = require('./util');

// const MAX_VISITS = 7;

// /* eslint-disable */

// const VisitDTO = new StructType({
//   id: ref.types.int,
//   window_start_time: ref.types.double,
//   window_end_time: ref.types.double,
//   duration: ref.types.double,
//   priority: ref.types.int
// });

// const AnchoredVisitDTO = new StructType({
//   visit: ref.refType(VisitDTO),
//   travel_time_to_next: ref.types.double,
//   opt_time: ref.types.double,
//   window_start_time_slack: ref.types.double,
//   window_end_time_slack: ref.types.double
// });

// const ButlerWorkDayDTO = new StructType({
//   window_start_time: ref.types.double,
//   window_end_time: ref.types.double
// });

// const ScheduleDTO = new StructType({
//   visits: ref.refType(AnchoredVisitDTO),
//   num_visits: ref.types.int,
//   constraints_satisfied: ref.types.int,
//   cost: ref.types.double,
//   efficiency: ref.types.double,
//   butler_window_start_time_slack: ref.types.double,
//   butler_window_end_time_slack: ref.types.double
// });

// const VisitArrayDTO = new ArrayType(VisitDTO);

// const TravelTimeMatrixDTO = new ArrayType(ref.types.double);

// const lib = new ffi.Library('libjsch', {
//   init_schedule: [ref.types.void, [ref.refType(ScheduleDTO), ref.types.int]],
//   free_schedule: [ref.types.void, [ref.refType(ScheduleDTO)]],
//   populate_schedule: [ref.types.void, [ref.refType(ScheduleDTO), VisitArrayDTO, ref.refType(ButlerWorkDayDTO), TravelTimeMatrixDTO]]
// });

// const serializeVisits = (visits) => {
//   let visitStructs = new VisitArrayDTO(visits.length);
//   for (var i = 0; i < visits.length; i++) {

//     let visitStruct = new VisitDTO({
//       id: i,
//       window_start_time: serializeFloatTime(visits[i].windowStartTime),
//       window_end_time: serializeFloatTime(visits[i].windowEndTime),
//       duration: serializeFloatTime(visits[i].duration),
//       priority: 1
//     });
//     visitStructs[i] = visitStruct;
//   }
//   return visitStructs;
// };

// const serializeTravelTimeMatrix = (matrix) => {
//   const dim = matrix.length;
//   let travelTimeMatrix = new TravelTimeMatrixDTO(dim * dim);
//   matrix.forEach((row, rowIdx) => {
//     row.forEach((v, colIdx) => {
//       travelTimeMatrix[(dim * rowIdx) + colIdx] = v;
//     });
//   });
//   return travelTimeMatrix;
// }

// export const generateSchedule = (visits, butlerWorkDay, hasCar) => {

//   let trunc = false;
//   if (visits.length > MAX_VISITS) { // For safety don't generate overly long schedules (as exponential time to generate)
//     visits = visits.slice(0, MAX_VISITS);
//     trunc = true;
//   }

//   const visitStructs = serializeVisits(visits);

//   // Build locations array as each visit location, with the butler home location appended to the end
//   const locations = visits.map(v => v.geopoint);
//   locations.push((butlerWorkDay && butlerWorkDay.butlerAddressGeopoint) || {lat: 0.0, lng: 0.0});

//   const travelTimeMatrix = locations.map(l1 => {
//     return locations.map(l2 => {
//       return travelHoursBetweenGeopoints(l1, l2, hasCar);
//     });
//   });
//   const travelTimeMatrixS = serializeTravelTimeMatrix(travelTimeMatrix);

//   const butlerWorkDayStruct = butlerWorkDay
//     ? new ButlerWorkDayDTO({
//         window_start_time: serializeFloatTime(butlerWorkDay.windowStartTime),
//         window_end_time: serializeFloatTime(butlerWorkDay.windowEndTime)
//       })
//     : new ButlerWorkDayDTO({ // Standard work hours as a fallback
//         window_start_time: 9,
//         window_end_time: 5
//       })

//   return new Promise((resolve, reject) => {
//     var sch = new ScheduleDTO();
//     lib.init_schedule(sch.ref(), visitStructs.length);
//     lib.populate_schedule.async(sch.ref(), visitStructs, butlerWorkDayStruct.ref(), travelTimeMatrixS, () => {
//       let anchoredVisits = [];
//       for (var i = 0; i < visitStructs.length; i++) {
//         const v = new AnchoredVisitDTO(ref.reinterpret(sch.visits, AnchoredVisitDTO.size, i * AnchoredVisitDTO.size));
//         const visitIdx = v.visit.deref().id;
//         const roundedOptTime = roundHoursToNearest5Min(v.opt_time);
//         anchoredVisits.push({
//           visitIdx: visitIdx,
//           startTime: deserializeFloatTime(roundedOptTime),
//           endTime: deserializeFloatTime(roundedOptTime + visitStructs[visitIdx].duration),
//           windowStartTimeSlack: v.window_start_time_slack,
//           windowEndTimeSlack: v.window_end_time_slack
//         });
//       }

//       const result = {
//         cost: sch.cost,
//         efficiency: sch.efficiency,
//         constraintsSatisfied: sch.constraints_satisfied ? true : false,
//         butlerWindowStartTimeSlack: sch.butler_window_start_time_slack,
//         butlerWindowEndTimeSlack: sch.butler_window_end_time_slack,
//         trunc: trunc,
//         anchoredVisits: anchoredVisits
//       };

//       lib.free_schedule(sch.ref());
//       resolve(result);
//     });
//   });
// };

// export const generateScheduleDelta = (visits, addedVisit, butlerWorkDay, hasCar) => {
//   const visitsAfter = [ ...visits, addedVisit ];
//   return Promise.all([
//     generateSchedule(visits, butlerWorkDay, hasCar),
//     generateSchedule(visitsAfter, butlerWorkDay, hasCar)
//   ]).then(schedules => {
//     const schBefore = schedules[0];
//     const schAfter = schedules[1];

//     const deltaCost = schAfter.cost - schBefore.cost;
//     const deltaEfficiency = schAfter.efficiency - schBefore.efficiency;

//     return Promise.resolve({
//       deltaCost: deltaCost,
//       deltaEfficiency: deltaEfficiency,
//       ...schAfter
//     });
//   });
// }
