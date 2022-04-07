const lib = require('./js/scheduler');
const {
  deserializeFloatTime,
  serializeFloatTime,
  travelHoursBetweenGeopoints,
  roundHoursToNearest5Min
} = require('./util');


const MAX_VISITS = 7;

const serializeVisits = (visits) => {
  let visitStructs = [];
  for (var i = 0; i < visits.length; i++) {
    visitStructs[i] = {
      id: i,
      window_start_time: serializeFloatTime(visits[i].windowStartTime),
      window_end_time: serializeFloatTime(visits[i].windowEndTime),
      duration: serializeFloatTime(visits[i].duration),
      priority: 1
    };
  }
  return visitStructs;
};

const serializeTravelTimeMatrix = (matrix) => {
  const dim = matrix.length;
  let travelTimeMatrix = [];
  matrix.forEach((row, rowIdx) => {
    row.forEach((v, colIdx) => {
      travelTimeMatrix[(dim * rowIdx) + colIdx] = v;
    });
  });
  return travelTimeMatrix;
}

export const generateSchedule = (visits, butlerWorkDay, hasCar) => {

  let trunc = false;
  if (visits.length > MAX_VISITS) { // For safety don't generate overly long schedules (as exponential time to generate)
    visits = visits.slice(0, MAX_VISITS);
    trunc = true;
  }

  const visitStructs = serializeVisits(visits);

  // Build locations array as each visit location, with the butler home location appended to the end
  const locations = visits.map(v => v.geopoint);
  locations.push((butlerWorkDay && butlerWorkDay.butlerAddressGeopoint) || {lat: 0.0, lng: 0.0});

  const travelTimeMatrix = locations.map(l1 => {
    return locations.map(l2 => {
      return travelHoursBetweenGeopoints(l1, l2, hasCar);
    });
  });
  const travelTimeMatrixS = serializeTravelTimeMatrix(travelTimeMatrix);


  const butlerWorkDayStruct = butlerWorkDay
    ? { window_start_time: serializeFloatTime(butlerWorkDay.windowStartTime),
        window_end_time: serializeFloatTime(butlerWorkDay.windowEndTime)}
    // Standard work hours as a fallback
    : {window_start_time: 9, window_end_time: 5};


  return new Promise((resolve, reject) => {
    var sch = lib.populate_schedule(visitStructs, butlerWorkDayStruct, travelTimeMatrixS);
    let anchoredVisits = [];
      for (var i = 0; i < visitStructs.length; i++) {
        const v = sch.anchored_visits[i];
        const visitIdx = v.visit.id;
        const roundedOptTime = roundHoursToNearest5Min(v.opt_time);
        anchoredVisits.push({
          visitIdx: visitIdx,
          startTime: deserializeFloatTime(roundedOptTime),
          endTime: deserializeFloatTime(roundedOptTime + visitStructs[visitIdx].duration),
          windowStartTimeSlack: v.window_start_time_slack,
          windowEndTimeSlack: v.window_end_time_slack
        });
      }

      const result = {
        cost: sch.cost,
        efficiency: sch.efficiency,
        constraintsSatisfied: sch.constraints_satisfied ? true : false,
        butlerWindowStartTimeSlack: sch.butler_window_start_time_slack,
        butlerWindowEndTimeSlack: sch.butler_window_end_time_slack,
        trunc: trunc,
        anchoredVisits: anchoredVisits
      };
      resolve(result);
  });
};

export const generateScheduleDelta = (visits, addedVisit, butlerWorkDay, hasCar) => {
  const visitsAfter = [ ...visits, addedVisit ];
  return Promise.all([
    generateSchedule(visits, butlerWorkDay, hasCar),
    generateSchedule(visitsAfter, butlerWorkDay, hasCar)
  ]).then(schedules => {
    const schBefore = schedules[0];
    const schAfter = schedules[1];

    const deltaCost = schAfter.cost - schBefore.cost;
    const deltaEfficiency = schAfter.efficiency - schBefore.efficiency;

    return Promise.resolve({
      deltaCost: deltaCost,
      deltaEfficiency: deltaEfficiency,
      ...schAfter
    });
  });
}

