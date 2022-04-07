/* eslint-disable no-unused-vars */

const { LocalTime, LocalDate, DayOfWeek, ChronoUnit, ChronoField } = require('js-joda');
const _ = require('lodash');
const geodist = require('geodist');

// This service should eventually be replaced with a proper allocation service.
// Designed to interface with the legacy front end; allocations are approximate
// and will not always be optimal. (this is also not RESTful best practice atm)

// Note the use of 'schedules' in the json output is not the same schedule as
// the 'schedules' service in this app (refers to a 'plan' for visits instead).

/*
Example input:

{
  "has_pets": false,
  "prefer_female": false,
  "latitude": -37.774112,
  "longitude": 145.024339,
  "state": "VIC",
  "week1day1time": "1:00",
  "week1day2time": "0:00",
  "week2day1time": "1:00",
  "week2day2time": "0:00"
}

Example output:

{
  "success": true,
  "possible_schedules": [
    {
      "butler": "Pamela",
      "day1_option": "WEDNESDAY",
      "day2_option": "NONE",
      "week_starting": 0,
      "w1d1_initial_visit_slots": [
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00"
      ],
      "w1d2_initial_visit_slots": [

      ],
      "w2d1_initial_visit_slots": [
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00"
      ],
      "w2d2_initial_visit_slots": [

      ]
    }
  ],
  "current_week_num": 1,
  "current_week_date": "2017-10-16",
  "current_date": "2017-10-19",
  "lead_days": 1
}
*/

const generateWeekDayCombinations = (numDays, daySpacing = 2) => {
  const toDay = DayOfWeek.FRIDAY.value() + 1; // Considering up to Friday
  const _gen = (numDays, fromDay = 1) => {
    const days = _.range(fromDay, toDay);
    if (numDays <= 0 || fromDay >= toDay) {
      return [[]];
    } else {
      return _.flatMap(days, d => {
        return _gen(numDays - 1, d + daySpacing).map(d2 => {
          return [d, ...d2];
        });
      });
    }
  };
  return _gen(numDays).filter(c => c.length === numDays);
};

const possibleButlersGroupedByWeekDay = (deltaSchedules, geopoint, efficiencyThreshold = 0.01, maxDist = 3000) => {
  const defaultVals = { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [] };
  const deltaSchedulesByWeekDay = _.merge(
    defaultVals,
    _.groupBy(deltaSchedules, s => {
      return LocalDate.parse(s.date.toString()).dayOfWeek().value();
    })
  );

  return _.mapValues(deltaSchedulesByWeekDay, deltaSchedulesOnWeekDay => {
    const byButler = _.groupBy(deltaSchedulesOnWeekDay, s => {
      return s.butlerId;
    });
    return _.keys(_.pickBy(byButler, deltaSchedulesForButler => {
      return deltaSchedulesForButler.every(s => {
        const geopointWithinCluster = s.anchoredVisits.some(v => {
          const dist = geodist({
            lat: v.geopoint.lat,
            lon: v.geopoint.lng
          }, {
            lat: geopoint.lat,
            lon: geopoint.lng
          }, {
            exact: true,
            unit: 'meters'
          });
          return dist <= maxDist && v.serviceId;
        });
        return s.constraintsSatisfied === true && s.deltaEfficiency > efficiencyThreshold && geopointWithinCluster;
      });
    }));
  });
};

const getPossibleTimes = (schedules, workDays, butler, date, duration = '00:00:00') => {
  const filteredSchedules = schedules.filter(s => s.butlerId === butler && s.date.toString() === date.toString());
  const filteredWorkDays = workDays.filter(w => w.butlerId === butler && w.date.toString() === date.toString());
  if (filteredWorkDays.length !== 1) {
    return [];
  }
  const schedule = filteredSchedules.length === 1
    ? filteredSchedules[0]
    : null;
  const workDay = filteredWorkDays[0]; // Should only be one match in any case (butler, date)

  const durationMins = Math.max(LocalTime.parse(duration).get(ChronoField.MINUTE_OF_DAY) - 1, 0);
  const startTime = LocalTime.parse(workDay.windowStartTime);
  const endTime = LocalTime.parse(workDay.windowEndTime).minusMinutes(durationMins);

  const numHhourBlocks = Math.round(startTime.until(endTime, ChronoUnit.MINUTES) / 30.0);
  let hhourBlockOK = _.range(numHhourBlocks + 1).map(hhour => {
    return startTime.plusMinutes(30 * hhour);
  });

  const buffMins = 15; // Assume 15 minute buffer either side of visit

  hhourBlockOK = hhourBlockOK.filter(hhourBlock => {
    return !schedule || schedule.anchoredVisits.every(anchoredVisit => {
      const visitStartTime = LocalTime.parse(anchoredVisit.startTime);
      const visitEndTime = LocalTime.parse(anchoredVisit.endTime);

      const visitWindowStartTime = anchoredVisit.windowStartTime ? LocalTime.parse(anchoredVisit.windowStartTime) : visitStartTime;
      const visitWindowEndTime = anchoredVisit.windowEndTime ? LocalTime.parse(anchoredVisit.windowEndTime) : visitEndTime;

      if (!visitWindowStartTime.equals(visitStartTime) || !visitWindowEndTime.equals(visitEndTime)) {
        return true; // Bypass check since window is non exact (wider)
      }

      // Check if hhourBlock is outside range (taking into account duration)
      return visitStartTime.minusMinutes(durationMins).isAfter(hhourBlock.plusMinutes(buffMins)) ||
        !visitEndTime.isAfter(hhourBlock.minusMinutes(buffMins));
    });
  });

  return hhourBlockOK.map(t => t.toString());
};

const normTimeStr = str => {
  if (str.split(':')[0].length === 1) {
    return '0' + str;
  }
  return str;
};

const weekDayToString = weekDay => {
  if (!weekDay) return weekDay;
  return DayOfWeek.of(weekDay).name().toUpperCase();
};

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find (params) {
    // 1. Find all butlers satisfying has_pets, and prefer_female (list A)
    // 2. Find upcoming schedules and shortlist based on whether visit could fit
    //    in without breaking constraints, and proximity to visit cluster
    // 3. From shortlisted schedules, derive days available on a per butler
    //    basis. (i.e. Butler A, MON, TUES, WED ; Butler B, MON, WED, THURS)
    // 4. For each day combination (based on weekly or twice weekly input),
    //    look up possible butler. Butler must be possible on *all* days to be
    //    considered.
    // 5. For butler and day combination, derive possible times. Times are based
    //    on the time window given in butler workDay, with blocks eliminated
    //    according to fixed anchored visits in schedules.

    if (!params.query.key || (params.query.key && params.query.key !== 'ZoZfip4Jnn')) {
      return Promise.resolve({}); // Helps prevent direct requests to end point (should be from legacy server only)
      // Not best practice to use a hardcoded secret, but high security isn't very important here
    }

    // Grab raw params
    const currentDate = (params.query.date && LocalDate.parse(params.query.date)) || LocalDate.now();
    const hasPets = params.query.has_pets || false;
    const preferFemale = params.query.prefer_female || false;
    const geopoint = {
      lat: params.query.latitude,
      lng: params.query.longitude
    };
    const w1d1time = LocalTime.parse(normTimeStr(params.query.week1day1time));
    const w1d2time = LocalTime.parse(normTimeStr(params.query.week1day2time));
    const w2d1time = LocalTime.parse(normTimeStr(params.query.week2day1time));
    const w2d2time = LocalTime.parse(normTimeStr(params.query.week2day2time));
    const mock = params.query.mock || false;

    // Derive max visit duration and number of visits per fortnight
    const allTimes = [ w1d1time, w1d2time, w2d1time, w2d2time ];
    const maxVisitDuration = allTimes.reduce((prev, current) => {
      return (prev > current) ? prev : current;
    });
    const visitsPerFortnight = allTimes.filter(t => LocalTime.parse('00:01').isBefore(t)).length;

    // Grab butlers satisfying hasPets and preferFemale
    let butlerQuery = { onFreeze: false };
    if (hasPets && (hasPets === true || hasPets === 'true')) {
      butlerQuery.handlesPets = true;
    }
    if (preferFemale && (preferFemale === true || preferFemale === 'true')) {
      butlerQuery.gender = 'f';
    }
    return this.app.service('butlers').find({ query: butlerQuery }).then(butlers => {
      const validButlers = butlers.map(b => b.id);

      const deltaVisit = {
        duration: maxVisitDuration.toString(),
        windowStartTime: '00:00:00', // Window is wide (assuming fluid alloc)
        windowEndTime: '23:59:59',
        geopoint: geopoint
      };

      const query = mock ? {} : {
        startDate: currentDate.with(DayOfWeek.MONDAY).toString(),
        endDate: currentDate.with(DayOfWeek.MONDAY).plusWeeks(3).toString()
      }; // Mock is used for automated tests

      return this.app.service('workDays').find({ query: query }).then(workDays => {
        return this.app.service('schedules').find({
          deltaVisit: deltaVisit,
          query: query
        }).then(deltaSchedules => {
          const possibleButlersByWeekDay = possibleButlersGroupedByWeekDay(deltaSchedules, geopoint, -0.5);

          const visitsPerWeek = visitsPerFortnight === 4 ? 2 : 1;
          const dayCombinations = generateWeekDayCombinations(visitsPerWeek);

          const possibleSchLegacy = _.flatten(dayCombinations.map(dayCombination => {
            const possibleButlers = dayCombination.reduce((butlersOkSoFar, day) => {
              return _.intersection(butlersOkSoFar, possibleButlersByWeekDay[day.toString()]);
            }, validButlers);

            return possibleButlers.map(possibleButler => {
              const dates = _.range(2).map(weekNumber => {
                return dayCombination.map(day => currentDate.plusWeeks(weekNumber).with(ChronoField.DAY_OF_WEEK, day));
              });
              const possibleTimes = dates.map(datesForWeek => {
                return datesForWeek.map(date => {
                  return getPossibleTimes(deltaSchedules, workDays, possibleButler, date.toString(), maxVisitDuration.toString());
                });
              });
              const butlerRec = butlers.filter(b => b.id === possibleButler)[0];
              return {
                butler: butlerRec.firstName + ' ' + butlerRec.lastName,
                day1_option: weekDayToString(dayCombination[0]),
                day2_option: weekDayToString(dayCombination[1]) || 'NONE',
                week_starting: 0,
                w1d1_initial_visit_slots: possibleTimes[0][0],
                w1d2_initial_visit_slots: possibleTimes[0][1] || [],
                w2d1_initial_visit_slots: possibleTimes[1][0],
                w2d2_initial_visit_slots: possibleTimes[1][1] || []
              };
            });
          }));

          const result = {
            success: true,
            possible_schedules: possibleSchLegacy,
            current_week_num: 0,
            current_week_date: currentDate.with(DayOfWeek.MONDAY).minusDays(1).toString(),
            current_date: currentDate.toString(),
            lead_days: 1
          };

          return Promise.resolve(result);
        });
      });
    });
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports._generateWeekDayCombinations = generateWeekDayCombinations;
module.exports._possibleButlersGroupedByWeekDay = possibleButlersGroupedByWeekDay;
module.exports._getPossibleTimes = getPossibleTimes;
