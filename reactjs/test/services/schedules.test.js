const chai = require('chai');
const expect = chai.expect;
const schedules = require('../../src/services/schedules/schedules.service.js');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const express = require('@feathersjs/express');
const { LocalDate, LocalTime } = require('js-joda');


describe('\'schedules\' service', () => {
  const db = require('./schedules-data/db-default');
  let server, app;
  beforeEach(done => {
    app = feathers()
      .configure(schedules)
      .use('/butlers', memory(db.butlers))
      .use('/workDays', memory(db.workDays))
      .use('/visits', memory(db.visits));

    server = express(app).listen(3030);

    server.once('listening', () => done());
  });

  afterEach(done => {
    server.close(done);
  });

  it('allocates visits to schedules correctly', () => {
    const service = app.service('schedules');

    // We expect 4 schedules:
    // butler #1, 2017-05-01 (2 visits, #3 then #1)
    // butler #1, 2017-05-08 (1 visit, #2)
    // butler #2, 2017-05-02 (1 visit, #4)
    // butler #2, 2017-05-03 (1 visit, #5)
    // Note schedules are generated on the visits results. Thus, even if there is
    // no corresponding work day for a schedule, it is still generated (and
    // should be reported as a constraint error in the result [tested later])

    const query = {};
    // Note: In reality the query would have a date range, but here we are
    // mocking the dependent services, so we want them to return all records

    return service.find({ query: query }).then(results => {
      expect(
        results.map(r => r.anchoredVisits.map(v => v.serviceAddressId))
      ).to.have.deep.members([
        [3, 1], // Note: order is important here (by constraints)
        [2],
        [4],
        [5]
      ]);
    });
  });

  it('associates work days with schedules correctly', () => {
    const service = app.service('schedules');

    // For each of the four schedules we expect a corresponding work day to be
    // associated, except in the case of 2017-05-03, whereby it should be noted
    // that the schedule is invalid in the response based on the butler not
    // actually being available to work on that day:
    // butler #1, 2017-05-01 - expect available
    // butler #1, 2017-05-08 - expect available
    // butler #2, 2017-05-02 - expect available
    // butler #2, 2017-05-03 - expect unavailable (no corresponding work day)

    const query = {};

    return service.find({ query: query }).then(results => {
      expect(
        results.map(r => {
          return {
            date: r.date.toString(),
            avail: r.butlerAvailable,
            butlerWindowStartTime: r.butlerWindowStartTime,
            butlerWindowEndTime: r.butlerWindowEndTime,
            butlerAddressId: r.butlerAddressId
          };
        })
      ).to.have.deep.members([
        {
          date: '2017-05-01',
          avail: true,
          butlerWindowStartTime: '08:00:00',
          butlerWindowEndTime: '12:00:00',
          butlerAddressId: 1
        },
        {
          date: '2017-05-08',
          avail: true,
          butlerWindowStartTime: '09:00:00',
          butlerWindowEndTime: '14:00:00',
          butlerAddressId: 2
        },
        {
          date: '2017-05-02',
          avail: true,
          butlerWindowStartTime: '12:00:00',
          butlerWindowEndTime: '17:00:00',
          butlerAddressId: 3
        },
        {
          date: '2017-05-03',
          avail: false,
          butlerWindowStartTime: undefined,
          butlerWindowEndTime: undefined,
          butlerAddressId: undefined
        }
      ]);
    });
  });

  it('associates butler details with schedules correctly', () => {
    const service = app.service('schedules');

    // butler #1, 2017-05-01 - expect 'John'
    // butler #1, 2017-05-08 - expect 'John'
    // butler #2, 2017-05-02 - expect 'Jane'
    // butler #2, 2017-05-03 - expect 'Jane'

    const query = {};

    return service.find({ query: query }).then(results => {
      expect(
        results.filter(r => r.butler.firstName === 'John' && r.butlerId === 1)
      ).to.have.lengthOf(2);
      expect(
        results.filter(r => r.butler.firstName === 'Jane' && r.butlerId === 2)
      ).to.have.lengthOf(2);
    });
  });

  it('generates schedules that obey butler work day window constraint', () => {
    const service = app.service('schedules');

    const query = {};

    return service.find({ query: query }).then(results => {
      results.forEach(r => {
        if (r.butlerAvailable) {
          // Test isn't relevant if butler isn't even available!
          const butlerWindowStartTime = LocalTime.parse(
            r.butlerWindowStartTime
          );
          const butlerWindowEndTime = LocalTime.parse(r.butlerWindowEndTime);

          r.anchoredVisits.forEach(v => {
            const startTime = LocalTime.parse(v.startTime);
            const endTime = LocalTime.parse(v.endTime);

            // For each visit, it must occur within the butler work day window
            // Otherwise, this constraint is violated
            expect(startTime.isBefore(butlerWindowStartTime)).to.be.false;
            expect(endTime.isAfter(butlerWindowEndTime)).to.be.false;
          });
        }
      });
    });
  });

  it('generates schedules that obey visit window constraints', () => {
    const service = app.service('schedules');

    const query = {};

    return service.find({ query: query }).then(results => {
      results.forEach(r => {
        r.anchoredVisits.forEach(v => {
          const startTime = LocalTime.parse(v.startTime);
          const endTime = LocalTime.parse(v.endTime);
          const windowStartTime = LocalTime.parse(v.windowStartTime);
          const windowEndTime = LocalTime.parse(v.windowEndTime);

          // For each visit, it must occur within the visit plan time window
          // Otherwise, this constraint is violated
          expect(startTime.isBefore(windowStartTime)).to.be.false;
          expect(endTime.isAfter(windowEndTime)).to.be.false;
        });
      });
    });
  });

  it('generates schedules that utilise butler mode of transport', () => {
    const service = app.service('schedules');

    const query = {};

    // Analyse butler #1 on 2015-05-01
    // We expect schedule to be more cost effective by default
    // We expect schedule to be less cost effective when car not available

    return service.find({ query: query }).then(results => {
      const schWithCar = results.filter(
        r => r.butlerId === 1 && r.date.toString() === '2017-05-01'
      )[0];

      return app
        .service('butlers')
        .patch(1, { hasCar: false })
        .then(() => {
          return service.find({ query: query }).then(results => {
            const schWithoutCar = results.filter(
              r => r.butlerId === 1 && r.date.toString() === '2017-05-01'
            )[0];

            expect(schWithCar.cost).to.be.below(schWithoutCar.cost);
          });
        });
    });
  });

  it('schedules with broken constraints are flagged', () => {
    const service = app.service('schedules');

    const query = {};

    return service.find({ query: query }).then(results => {
      const okSch = results.filter(
        r => r.butlerId === 1 && r.date.toString() === '2017-05-01'
      )[0];

      expect(okSch.constraintsSatisfied).to.be.true;

      return app
        .service('visits')
        .patch(1, { duration: '10:00:00' })
        .then(() => {
          return service.find({ query: query }).then(results => {
            const brokenSch = results.filter(
              r => r.butlerId === 1 && r.date.toString() === '2017-05-01'
            )[0];

            expect(brokenSch.constraintsSatisfied).to.be.false;
          });
        });
    });
  });

  it('schedules with deltaVisit param are computed with delta results present', () => {
    const service = app.service('schedules');

    const deltaVisit = {
      duration: '01:00:00',
      windowStartTime: '08:00:00',
      windowEndTime: '19:00:00',
      geopoint: { lat: 0.0, lng: 0.0 }
    };

    return service.find({ deltaVisit: deltaVisit, query:{} }).then(results => {
      expect(results.map(r => r.anchoredVisits.length)).to.have.deep.members([
        3,
        2,
        2,
        2
      ]);

      expect(results.map(r => r.deltaCost)).not.to.be.undefined;
      expect(results.map(r => r.deltaEfficiency)).not.to.be.undefined;
    });
  });
});

describe('\'schedules\' service - added more tests', () => {
  const db = require('./schedules-data/db1');
  let server, app;
  beforeEach(done => {
    app = feathers()
      .configure(schedules)
      .use('/butlers', memory(db.butlers))
      .use('/workDays', memory(db.workDays))
      .use('/visits', memory(db.visits));

    server = express(app).listen(3030);
    server.once('listening', () => done());
  });

  afterEach(done => server.close(done));
  it('test status', async () => {
    const query = {};
    const schedules = app.service('schedules');
    return schedules.find({ query }).then(results => {
      const status = results.map(item => item.analysis.status);
      expect(status).to.deep.equal(['warning', 'ok']);
    });
  });
});