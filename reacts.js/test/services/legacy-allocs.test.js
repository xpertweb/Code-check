const expect = require('chai').expect;
const {
  _generateWeekDayCombinations,
  _possibleButlersGroupedByWeekDay,
  _getPossibleTimes
} = require('../../src/services/legacy-allocs/legacy-allocs.class.js');
const { DayOfWeek } = require('js-joda');
const _ = require('lodash');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const legacyAllocs = require('../../src/services/legacy-allocs/legacy-allocs.service.js');
const concreteApp = require('../../src/app'); // For integration test
const {
  cleanDb,
  mockClient,
  mockButler,
  mockButlerAddress,
  mockService,
  mockServiceButler,
  mockServiceAddress,
  mockVisitPlan,
  mockWorkBlock
} = require('../_utils');
const express = require('@feathersjs/express');

describe('\'legacy-allocs\' service/module',function () {
  this.timeout(10000);
  describe('generateWeekDayCombinations()', () => {
    it('given 1 as input should return all valid combinations', () => {
      const combinations = _generateWeekDayCombinations(1);

      expect(combinations).to.deep.have.members([[1], [2], [3], [4], [5]]);
    });

    it('given 2 as input should return all valid combinations', () => {
      const combinations = _generateWeekDayCombinations(2);

      expect(combinations).to.deep.have.members([
        [1, 3],
        [1, 4],
        [1, 5],
        [2, 4],
        [2, 5],
        [3, 5]
      ]);
    });
  });

  const geopointFairfield = { lat: -37.792, lng: 145.011 };
  const geopointAlphington = { lat: -37.78, lng: 145.023 }; // Alphington is within 3km of Fairfield
  const geopointCarlton = { lat: -37.8001, lng: 144.9671 }; // Outside 3km
  const geopointCBD = { lat: -37.813628, lng: 144.963058 }; // Outside 3km

  describe('possibleButlersGroupedByWeekDay()', () => {
    it('populates each week day with an empty array by default', () => {
      const deltaSchedules = [];

      const result = _possibleButlersGroupedByWeekDay(
        deltaSchedules,
        geopointFairfield
      );

      _.range(1, 8).forEach(v => {
        expect(result[v]).to.deep.equal([]);
      });
    });

    it('correctly groups butlers by week day', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05', // Thurs
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '1',
              geopoint: geopointFairfield
            }
          ]
        },
        {
          butlerId: '1',
          date: '2017-10-12', // Thurs
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '2',
              geopoint: geopointFairfield
            }
          ]
        },
        {
          butlerId: '2',
          date: '2017-10-06', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '3',
              geopoint: geopointFairfield
            }
          ]
        },
        {
          butlerId: '3',
          date: '2017-10-06', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '4',
              geopoint: geopointFairfield
            }
          ]
        }
      ];

      const result = _possibleButlersGroupedByWeekDay(
        deltaSchedules,
        geopointFairfield
      );

      expect(result[DayOfWeek.THURSDAY.value()]).to.deep.equal(['1']);
      expect(result[DayOfWeek.FRIDAY.value()]).to.deep.equal(['2', '3']);
    });

    it('excludes butlers without sch satisfied constraints on at least one equivalent week day', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05', // Thurs
          constraintsSatisfied: false,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '1',
              geopoint: geopointFairfield
            }
          ]
        },
        {
          butlerId: '1',
          date: '2017-10-12', // Thurs
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '2',
              geopoint: geopointFairfield
            }
          ]
        },
        {
          butlerId: '2',
          date: '2017-10-06', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '3',
              geopoint: geopointFairfield
            }
          ]
        }
      ];

      const result = _possibleButlersGroupedByWeekDay(
        deltaSchedules,
        geopointFairfield
      );

      expect(result[DayOfWeek.THURSDAY.value()]).to.deep.equal([]);
      expect(result[DayOfWeek.FRIDAY.value()]).to.deep.equal(['2']);
    });

    it('excludes butlers with sch decrease in efficiency on at least one equivalent week day', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05', // Thurs
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '1',
              geopoint: geopointFairfield
            }
          ]
        },
        {
          butlerId: '2',
          date: '2017-10-06', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: -0.01,
          anchoredVisits: [
            {
              serviceId: '2',
              geopoint: geopointFairfield
            }
          ]
        },
        {
          butlerId: '2',
          date: '2017-10-13', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '3',
              geopoint: geopointFairfield
            }
          ]
        }
      ];

      const result = _possibleButlersGroupedByWeekDay(
        deltaSchedules,
        geopointFairfield
      );

      expect(result[DayOfWeek.THURSDAY.value()]).to.deep.equal(['1']);
      expect(result[DayOfWeek.FRIDAY.value()]).to.deep.equal([]);
    });

    it('excludes butlers with sch visit geopoint exclusion on at least one equivalent week day', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05', // Thurs
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '1',
              geopoint: geopointAlphington
            },
            {
              serviceId: '2',
              geopoint: geopointCBD
            }
          ]
        },
        {
          butlerId: '2',
          date: '2017-10-06', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '3',
              geopoint: geopointCarlton
            }
          ]
        },
        {
          butlerId: '2',
          date: '2017-10-13', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '4',
              geopoint: geopointCBD
            }
          ]
        }
      ];

      const result = _possibleButlersGroupedByWeekDay(
        deltaSchedules,
        geopointFairfield
      );

      expect(result[DayOfWeek.THURSDAY.value()]).to.deep.equal(['1']);
      expect(result[DayOfWeek.FRIDAY.value()]).to.deep.equal([]);
    });

    it('visit geopoint without serviceId is excluded from query checks (i.e. exclude self)', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05', // Thurs
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              serviceId: '1',
              geopoint: geopointAlphington
            }
          ]
        },
        {
          butlerId: '2',
          date: '2017-10-06', // Fri
          constraintsSatisfied: true,
          deltaEfficiency: 0.5,
          anchoredVisits: [
            {
              geopoint: geopointFairfield
            }
          ]
        }
      ];

      const result = _possibleButlersGroupedByWeekDay(
        deltaSchedules,
        geopointFairfield
      );

      expect(result[DayOfWeek.THURSDAY.value()]).to.deep.equal(['1']);
      expect(result[DayOfWeek.FRIDAY.value()]).to.deep.equal([]);
    });
  });

  describe('getPossibleTimes()', () => {
    it('generates no times if no schedules matching butler and date passed', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05',
          anchoredVisits: []
        },
        {
          butlerId: '2',
          date: '2017-10-06',
          anchoredVisits: []
        }
      ];
      const workDays = [
        {
          butlerId: '1',
          date: '2017-10-05',
          windowStartTime: '09:00:00',
          windowEndTime: '17:00:00'
        },
        {
          butlerId: '2',
          date: '2017-10-06',
          windowStartTime: '09:00:00',
          windowEndTime: '17:00:00'
        }
      ];
      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-06'
      );

      expect(times).to.have.lengthOf(0);
    });

    it('generates no times if matching schedule does not have corresponding work day', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05',
          anchoredVisits: []
        }
      ];
      const workDays = [];

      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-05'
      );

      expect(times).to.have.lengthOf(0);
    });

    it('generates all (half hour) slot times according to butler window (default duration empty)', () => {
      const deltaSchedules = [];
      const workDays = [
        {
          butlerId: '1',
          date: '2017-10-05',
          windowStartTime: '09:00:00',
          windowEndTime: '11:00:00'
        }
      ];

      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-05'
      );

      expect(times).to.have.members([
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00'
      ]);
    });

    it('generates all (half hour) slot times according to butler window with duration supplied', () => {
      const deltaSchedules = [];
      const workDays = [
        {
          butlerId: '1',
          date: '2017-10-05',
          windowStartTime: '10:00:00',
          windowEndTime: '12:30:00'
        }
      ];

      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-05',
        '01:00'
      );

      expect(times).to.have.members(['10:00', '10:30', '11:00', '11:30']);
    });

    it('eliminates all (half hour) slot times according to anchored visits', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05',
          anchoredVisits: [
            {
              startTime: '09:00:00',
              endTime: '10:00:00'
            },
            {
              startTime: '11:00:00',
              endTime: '12:00:00'
            }
          ]
        }
      ];
      const workDays = [
        {
          butlerId: '1',
          date: '2017-10-05',
          windowStartTime: '09:00:00',
          windowEndTime: '13:00:00'
        }
      ];

      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-05'
      );

      expect(times).to.have.members(['10:30', '12:30', '13:00']);
    });

    it('eliminates all (half hour) slot times conservatively against non-half-hour-rounded time ranges', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05',
          anchoredVisits: [
            {
              startTime: '09:55:00',
              endTime: '11:02:00'
            }
          ]
        }
      ];
      const workDays = [
        {
          butlerId: '1',
          date: '2017-10-05',
          windowStartTime: '09:00:00',
          windowEndTime: '13:00:00'
        }
      ];

      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-05'
      );

      expect(times).to.have.members([
        '09:00',
        '09:30',
        '11:30',
        '12:00',
        '12:30',
        '13:00'
      ]);
    });

    it('eliminates all (half hour) slot times accounting for visit duration', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05',
          anchoredVisits: [
            {
              startTime: '09:30:00',
              endTime: '10:30:00'
            },
            {
              startTime: '14:30:00',
              endTime: '15:30:00'
            }
          ]
        }
      ];

      const workDays = [
        {
          butlerId: '1',
          date: '2017-10-05',
          windowStartTime: '09:00:00',
          windowEndTime: '17:30:00'
        }
      ];

      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-05',
        '01:30:00'
      );

      expect(times).to.have.members([
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '16:00'
      ]);
    });

    it('does not eliminate (half hour) slot times if anchored visit has non-exact possible window', () => {
      const deltaSchedules = [
        {
          butlerId: '1',
          date: '2017-10-05',
          anchoredVisits: [
            {
              windowStartTime: '09:00:00',
              windowEndTime: '10:00:00', // Exact window, should be eliminated
              startTime: '09:00:00',
              endTime: '10:00:00'
            },
            {
              windowStartTime: '09:00:00',
              windowEndTime: '12:00:00', // Wide window, should *not* be eliminated
              startTime: '10:30:00',
              endTime: '11:30:00'
            }
          ]
        }
      ];
      const workDays = [
        {
          butlerId: '1',
          date: '2017-10-05',
          windowStartTime: '09:00:00',
          windowEndTime: '13:00:00'
        }
      ];

      const times = _getPossibleTimes(
        deltaSchedules,
        workDays,
        '1',
        '2017-10-05'
      );

      expect(times).to.have.members([
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00'
      ]);
    });
  });

  describe('service', () => {
    let server, app;

    beforeEach(done => {
      app = feathers()
        .configure(legacyAllocs)
        .use(
          '/butlers',
          memory({
            name: 'butlers',
            store: {
              '1': {
                id: '1',
                gender: 'm',
                handlesPets: true,
                onFreeze: false,
                firstName: 'John',
                lastName: 'Doe'
              },
              '2': {
                id: '2',
                gender: 'f',
                handlesPets: true,
                onFreeze: false,
                firstName: 'Jane',
                lastName: 'Doe'
              },
              '3': {
                id: '3',
                gender: 'f',
                handlesPets: false,
                onFreeze: false,
                firstName: 'Jill',
                lastName: 'Doe'
              }
            }
          })
        )
        .use(
          '/schedules',
          memory({
            name: 'schedules',
            store: {
              '1': {
                butlerId: '1',
                date: '2017-10-05', // Thurs
                constraintsSatisfied: true,
                deltaEfficiency: 0.5,
                anchoredVisits: [
                  {
                    serviceId: '1',
                    geopoint: geopointAlphington,
                    windowStartTime: '09:00:00',
                    windowEndTime: '10:00:00',
                    startTime: '09:00:00',
                    endTime: '10:00:00'
                  },
                  {
                    serviceId: '1',
                    geopoint: geopointAlphington,
                    windowStartTime: '09:00:00',
                    windowEndTime: '12:00:00',
                    startTime: '10:30:00',
                    endTime: '11:30:00'
                  }
                ]
              },
              '2': {
                butlerId: '1',
                date: '2017-10-12', // Thurs
                constraintsSatisfied: true,
                deltaEfficiency: 0.5,
                anchoredVisits: [
                  {
                    serviceId: '1',
                    geopoint: geopointFairfield,
                    windowStartTime: '10:00:00',
                    windowEndTime: '11:00:00',
                    startTime: '10:00:00',
                    endTime: '11:00:00'
                  },
                  {
                    serviceId: '1',
                    geopoint: geopointFairfield,
                    windowStartTime: '09:00:00',
                    windowEndTime: '12:00:00',
                    startTime: '11:30:00',
                    endTime: '12:30:00'
                  }
                ]
              },
              '3': {
                butlerId: '1',
                date: '2017-10-06', // Fri
                constraintsSatisfied: true,
                deltaEfficiency: 0.5,
                anchoredVisits: [
                  {
                    serviceId: '1',
                    geopoint: geopointFairfield,
                    windowStartTime: '10:30:00',
                    windowEndTime: '11:30:00',
                    startTime: '10:30:00',
                    endTime: '11:30:00'
                  }
                ]
              },
              '4': {
                butlerId: '2',
                date: '2017-10-05', // Thurs
                constraintsSatisfied: true,
                deltaEfficiency: 0.5,
                anchoredVisits: [
                  {
                    serviceId: '1',
                    geopoint: geopointCBD,
                    windowStartTime: '09:00:00',
                    windowEndTime: '14:30:00',
                    startTime: '10:30:00',
                    endTime: '11:30:00'
                  },
                  {
                    geopoint: geopointCarlton,
                    windowStartTime: '09:00:00',
                    windowEndTime: '14:00:00',
                    startTime: '12:00:00',
                    endTime: '13:00:00'
                  }
                ]
              },
              '5': {
                butlerId: '2',
                date: '2017-10-02', // Mon
                constraintsSatisfied: true,
                deltaEfficiency: 0.5,
                anchoredVisits: [
                  {
                    serviceId: '1',
                    geopoint: geopointCBD,
                    windowStartTime: '09:00:00',
                    windowEndTime: '14:30:00',
                    startTime: '10:30:00',
                    endTime: '11:30:00'
                  }
                ]
              },
              '6': {
                butlerId: '2',
                date: '2017-10-03', // Tues
                constraintsSatisfied: true,
                deltaEfficiency: 0.5,
                anchoredVisits: [
                  {
                    serviceId: '1',
                    geopoint: geopointCBD,
                    windowStartTime: '09:00:00',
                    windowEndTime: '14:30:00',
                    startTime: '10:30:00',
                    endTime: '11:30:00'
                  }
                ]
              },
              '7': {
                butlerId: '3',
                date: '2017-10-05', // Thurs
                constraintsSatisfied: true,
                deltaEfficiency: 0.5,
                anchoredVisits: [
                  {
                    serviceId: '1',
                    geopoint: geopointAlphington,
                    windowStartTime: '09:00:00',
                    windowEndTime: '14:30:00',
                    startTime: '10:30:00',
                    endTime: '11:30:00'
                  }
                ]
              }
            }
          })
        )
        .use(
          '/workDays',
          memory({
            name: 'workDays',
            store: {
              '1': {
                butlerId: '1',
                date: '2017-10-05', // Thurs
                windowStartTime: '09:00:00',
                windowEndTime: '13:00:00'
              },
              '2': {
                butlerId: '1',
                date: '2017-10-12', // Thurs
                windowStartTime: '09:00:00',
                windowEndTime: '13:00:00'
              },
              '3': {
                butlerId: '1',
                date: '2017-10-06', // Fri
                windowStartTime: '09:00:00',
                windowEndTime: '14:00:00'
              },
              '4': {
                butlerId: '1',
                date: '2017-10-13', // Fri
                windowStartTime: '09:00:00',
                windowEndTime: '14:00:00'
              },
              '5': {
                butlerId: '2',
                date: '2017-10-05', // Thurs
                windowStartTime: '10:00:00',
                windowEndTime: '12:00:00'
              },
              '6': {
                butlerId: '2',
                date: '2017-10-12', // Thurs
                windowStartTime: '10:30:00',
                windowEndTime: '12:00:00'
              },
              '7': {
                butlerId: '2',
                date: '2017-10-02', // Mon
                windowStartTime: '10:00:00',
                windowEndTime: '13:00:00'
              },
              '8': {
                butlerId: '2',
                date: '2017-10-09', // Mon
                windowStartTime: '10:00:00',
                windowEndTime: '12:30:00'
              },
              '9': {
                butlerId: '2',
                date: '2017-10-03', // Tues
                windowStartTime: '10:00:00',
                windowEndTime: '13:00:00'
              },
              '10': {
                butlerId: '2',
                date: '2017-10-10', // Tues
                windowStartTime: '10:00:00',
                windowEndTime: '13:00:00'
              },
              '11': {
                butlerId: '3',
                date: '2017-10-05', // Thurs
                windowStartTime: '10:00:00',
                windowEndTime: '12:00:00'
              }
            }
          })
        );

      server = express(app).listen(3030);

      server.once('listening', () => done());
    });

    afterEach(done => {
      server.close(done);
    });

    it('metadata is correct based on passed date', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-04',
        mock: true,
        has_pets: false,
        prefer_female: false,
        latitude: 0.0,
        longitude: 0.0,
        week1day1time: '1:00',
        week1day2time: '0:00',
        week2day1time: '1:00',
        week2day2time: '0:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r).to.deep.include({
          success: true,
          current_week_num: 0,
          current_week_date: '2017-10-01', // Should correspond to Sunday
          current_date: '2017-10-04',
          lead_days: 1
        });
      });
    });

    it('weekly allocations are detected correctly', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        mock: true,
        has_pets: false,
        prefer_female: false,
        latitude: geopointFairfield.lat,
        longitude: geopointFairfield.lng,
        week1day1time: '1:00',
        week1day2time: '0:00',
        week2day1time: '1:00',
        week2day2time: '0:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r.possible_schedules).to.have.deep.members([
          {
            butler: 'John Doe',
            day1_option: 'THURSDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: ['10:30', '11:00', '11:30', '12:00'],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: ['11:30', '12:00'],
            w2d2_initial_visit_slots: []
          },
          {
            butler: 'John Doe',
            day1_option: 'FRIDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: ['09:00', '12:00', '12:30', '13:00'],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: [
              '09:00',
              '09:30',
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00',
              '12:30',
              '13:00'
            ],
            w2d2_initial_visit_slots: []
          },
          {
            butler: 'Jill Doe',
            day1_option: 'THURSDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: ['10:00', '10:30', '11:00'],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: [],
            w2d2_initial_visit_slots: []
          }
        ]);
      });
    });

    it('twice weekly allocations are detected correctly', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        mock: true,
        has_pets: false,
        prefer_female: false,
        latitude: geopointCBD.lat,
        longitude: geopointCBD.lng,
        week1day1time: '1:00',
        week1day2time: '1:00',
        week2day1time: '1:00',
        week2day2time: '1:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r.possible_schedules).to.have.deep.members([
          {
            butler: 'Jane Doe',
            day1_option: 'MONDAY',
            day2_option: 'THURSDAY',
            week_starting: 0,
            w1d1_initial_visit_slots: [
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00'
            ],
            w1d2_initial_visit_slots: ['10:00', '10:30', '11:00'],
            w2d1_initial_visit_slots: ['10:00', '10:30', '11:00', '11:30'],
            w2d2_initial_visit_slots: ['10:30', '11:00']
          },
          {
            butler: 'Jane Doe',
            day1_option: 'TUESDAY',
            day2_option: 'THURSDAY',
            week_starting: 0,
            w1d1_initial_visit_slots: [
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00'
            ],
            w1d2_initial_visit_slots: ['10:00', '10:30', '11:00'],
            w2d1_initial_visit_slots: [
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00'
            ],
            w2d2_initial_visit_slots: ['10:30', '11:00']
          }
        ]);
      });
    });

    it('fortnightly allocations are detected correctly', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        mock: true,
        has_pets: false,
        prefer_female: false,
        latitude: geopointFairfield.lat,
        longitude: geopointFairfield.lng,
        week1day1time: '1:30',
        week1day2time: '0:00',
        week2day1time: '0:00',
        week2day2time: '0:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r.possible_schedules).to.have.deep.members([
          {
            butler: 'John Doe',
            day1_option: 'THURSDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: ['10:30', '11:00', '11:30'],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: ['11:30'],
            w2d2_initial_visit_slots: []
          },
          {
            butler: 'John Doe',
            day1_option: 'FRIDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: ['12:00', '12:30'],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: [
              '09:00',
              '09:30',
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00',
              '12:30'
            ],
            w2d2_initial_visit_slots: []
          },
          {
            butler: 'Jill Doe',
            day1_option: 'THURSDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: ['10:00', '10:30'],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: [],
            w2d2_initial_visit_slots: []
          }
        ]);
      });
    });


    //commented
    xit('allocs excluded when not enough capacity (i.e. constraints broken)', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        mock: true,
        has_pets: false,
        prefer_female: false,
        latitude: geopointFairfield.lat,
        longitude: geopointFairfield.lng,
        week1day1time: '6:00', // Too long for any allocs
        week1day2time: '0:00',
        week2day1time: '6:00',
        week2day2time: '0:00'
      };

      // (First we simulate broken constraints due to large durations)
      const breakConstraints = Promise.all(
        _.range(1, 8).map(id => {
          app
            .service('schedules')
            .patch(id.toString(), { constraintsSatisfied: false });
        })
      );
      return breakConstraints.then(() => {
        return service.find({ query: query }).then(r => {
          expect(r.possible_schedules).to.have.lengthOf(0); // Normally would be 3 (see weekly alloc test)
        });
      });
    });

    it('non-pet-handling butlers are excluded from allocs with pets', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        mock: true,
        has_pets: true,
        prefer_female: false,
        latitude: geopointFairfield.lat,
        longitude: geopointFairfield.lng,
        week1day1time: '1:00',
        week1day2time: '0:00',
        week2day1time: '1:00',
        week2day2time: '0:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r.possible_schedules).to.have.lengthOf(2); // Normally would be 3 (see weekly alloc test)
        expect(
          r.possible_schedules.filter(s => s.butler === 'John Doe')
        ).to.have.lengthOf(2);
      });
    });

    it('non-female butlers are excluded from allocs with female preference', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        mock: true,
        has_pets: false,
        prefer_female: true,
        latitude: geopointFairfield.lat,
        longitude: geopointFairfield.lng,
        week1day1time: '1:00',
        week1day2time: '0:00',
        week2day1time: '1:00',
        week2day2time: '0:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r.possible_schedules).to.have.lengthOf(1); // Normally would be 3 (see weekly alloc test)
        expect(
          r.possible_schedules.filter(s => s.butler === 'Jill Doe')
        ).to.have.lengthOf(1);
      });
    });

    it('frozen butlers are excluded from allocs', () => {
      const service = app.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        mock: true,
        has_pets: false,
        prefer_female: false,
        latitude: geopointFairfield.lat,
        longitude: geopointFairfield.lng,
        week1day1time: '1:00',
        week1day2time: '0:00',
        week2day1time: '1:00',
        week2day2time: '0:00'
      };

      return app
        .service('butlers')
        .patch('1', { onFreeze: true })
        .then(() => {
          // Set John Doe to be frozen
          return service.find({ query: query }).then(r => {
            expect(r.possible_schedules).to.have.lengthOf(1); // Normally would be 3 (see weekly alloc test)
            expect(
              r.possible_schedules.filter(s => s.butler === 'Jill Doe')
            ).to.have.lengthOf(1);
          });
        });
    });
  });

  describe('full integration test', () => {
    let server, client1, butler1, butler2, service1, service2;

    before(done => {
      server = concreteApp.listen(3031);
      server.once('listening', () => done());
    });

    after(done => {
      server.close(done);
    });

    beforeEach(() => {
      return cleanDb(concreteApp)
        .then(() => {
          return concreteApp.service('clients').create(mockClient());
        })
        .then(client => {
          client1 = client;

          return concreteApp
            .service('butlers')
            .create(mockButler('John', 'Doe'));
        })
        .then(butler => {
          butler1 = butler;

          return concreteApp
            .service('butlers')
            .create(mockButler('Jane', 'Doe'));
        })
        .then(butler => {
          butler2 = butler;

          return concreteApp
            .service('services')
            .create(mockService(client1.id));
        })
        .then(service => {
          service1 = service;

          return concreteApp
            .service('services')
            .create(mockService(client1.id));
        })
        .then(service => {
          service2 = service;

          return concreteApp
            .service('serviceButlers')
            .create(mockServiceButler(service1.id, butler1.id, '2017-10-01'));
        })
        .then(() => {
          return concreteApp
            .service('serviceButlers')
            .create(mockServiceButler(service2.id, butler2.id, '2017-10-01'));
        })
        .then(() => {
          return concreteApp
            .service('serviceAddresses')
            .create(mockServiceAddress(service1.id, '2017-10-01'));
        })
        .then(() => {
          return concreteApp
            .service('serviceAddresses')
            .create(mockServiceAddress(service2.id, '2017-10-01'));
        })
        .then(() => {
          return concreteApp
            .service('butlerAddresses')
            .create(mockButlerAddress(butler1.id, '2017-10-01'));
        })
        .then(() => {
          return concreteApp
            .service('butlerAddresses')
            .create(mockButlerAddress(butler2.id, '2017-10-01'));
        })
        .then(() => {
          return Promise.all([
            concreteApp.service('visitPlans').create(
              mockVisitPlan(
                service1.id,
                'w',
                '2017-10-03', // Tues
                null,
                '09:00:00',
                '12:00:00',
                '01:00:00'
              )
            ),
            concreteApp.service('visitPlans').create(
              mockVisitPlan(
                service1.id,
                'n',
                '2017-10-10', // Tues
                null,
                '11:00:00',
                '12:00:00',
                '01:00:00'
              )
            ), // (note: one off visit with fixed window 11am-12pm)
            concreteApp.service('visitPlans').create(
              mockVisitPlan(
                service1.id,
                'w',
                '2017-10-05', // Thurs
                null,
                '10:00:00',
                '11:00:00', // Note: Fixed time based on narrow window
                '01:00:00'
              )
            ),
            concreteApp.service('visitPlans').create(
              mockVisitPlan(
                service2.id,
                'w',
                '2017-10-05', // Thurs
                null,
                '09:00:00',
                '13:00:00',
                '01:00:00'
              )
            )
          ]);
        })
        .then(() => {
          return Promise.all([
            concreteApp.service('workBlocks').create(
              mockWorkBlock(
                butler1.id,
                '2017-10-03', // Tues
                null,
                '09:00:00',
                '14:00:00'
              )
            ),
            concreteApp.service('workBlocks').create(
              mockWorkBlock(
                butler1.id,
                '2017-10-05', // Thurs
                null,
                '09:00:00',
                '13:00:00'
              )
            ),
            concreteApp.service('workBlocks').create(
              mockWorkBlock(
                butler2.id,
                '2017-10-05', // Thurs
                null,
                '09:00:00',
                '17:00:00'
              )
            )
          ]);
        });
    });

    xit('weekly alloc', () => {
      const service = concreteApp.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        has_pets: false,
        prefer_female: false,
        latitude: 0.0,
        longitude: 0.0,
        week1day1time: '1:00',
        week1day2time: '0:00',
        week2day1time: '1:00',
        week2day2time: '0:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r.possible_schedules).to.have.deep.members([
          {
            butler: 'John Doe',
            day1_option: 'TUESDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: [
              '09:00',
              '09:30',
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00',
              '12:30',
              '13:00'
            ],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: [
              '09:00',
              '09:30',
              '12:30', // Note: less available times this week due to one-off visit plan with narrow window (see declaration above)
              '13:00'
            ],
            w2d2_initial_visit_slots: []
          },
          {
            butler: 'John Doe',
            day1_option: 'THURSDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: ['11:30', '12:00'],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: ['11:30', '12:00'],
            w2d2_initial_visit_slots: []
          },
          {
            butler: 'Jane Doe',
            day1_option: 'THURSDAY',
            day2_option: 'NONE',
            week_starting: 0,
            w1d1_initial_visit_slots: [
              '09:00',
              '09:30',
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00',
              '12:30',
              '13:00',
              '13:30',
              '14:00',
              '14:30',
              '15:00',
              '15:30',
              '16:00'
            ],
            w1d2_initial_visit_slots: [],
            w2d1_initial_visit_slots: [
              '09:00',
              '09:30',
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00',
              '12:30',
              '13:00',
              '13:30',
              '14:00',
              '14:30',
              '15:00',
              '15:30',
              '16:00'
            ],
            w2d2_initial_visit_slots: []
          }
        ]);
      });
    });

    xit('visit duration that breaks constraints narrows results', () => {
      const service = concreteApp.service('legacyAllocs');

      const query = {
        key: 'ZoZfip4Jnn',
        date: '2017-10-03',
        has_pets: false,
        prefer_female: false,
        latitude: 0.0,
        longitude: 0.0,
        week1day1time: '3:00',
        week1day2time: '0:00',
        week2day1time: '3:00',
        week2day2time: '0:00'
      };

      return service.find({ query: query }).then(r => {
        expect(r.possible_schedules).to.have.lengthOf(1); // Normally 3 as above
        expect(
          r.possible_schedules.filter(s => s.butler === 'Jane Doe')
        ).to.have.lengthOf(1);
      });
    });
  });
});
