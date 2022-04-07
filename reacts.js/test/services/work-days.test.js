const { expect } = require('chai');
const app = require('../../src/app');
const knexCleaner = require('knex-cleaner');
const faker = require('faker');

// Integration tests for work days

describe('\'workDays\' service', function () {
  this.timeout(7000);
  const knex = app.get('knexClient');

  const mockButler = () => {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: faker.internet.email(),
      password: 'aa',
      phoneNumber: '0458661904',
      gender: 'm',
      rating: 5,
      onFreeze: false,
      handlesPets: false,
      hasCar: false,
      maxTravelDistance: 1000.0
    };
  };

  const mockButlerAddress = (butlerId, activeFrom) => {
    return {
      butlerId: butlerId,
      line1: 'Street',
      line2: '',
      locale: 'Suburb',
      state: 'VIC',
      country: 'Australia',
      postcode: '3000',
      activeFrom: activeFrom
    };
  };

  const mockWorkBlock = (butlerId, startDate, endDate) => {
    return {
      butlerId: butlerId,
      startDate: startDate,
      endDate: endDate,
      windowStartTime: '09:00:00',
      windowEndTime: '15:00:00'
    };
  };

  let butler1, butler2, butlerAddress1, butlerAddress2;

  beforeEach(() => {
    return knexCleaner.clean(knex, {
      mode: 'truncate',
      ignoreTables: ['knex_migrations', 'knex_migrations_lock']
    }).then(() => {
      return app.service('butlers').create(mockButler());
    }).then(butler => {
      butler1 = butler;

      return app.service('butlers').create(mockButler());
    }).then(butler => {
      butler2 = butler;

      return app.service('butlerAddresses').create(mockButlerAddress(butler1.id, '2017-05-01'));
    }).then(butlerAddress => {
      butlerAddress1 = butlerAddress;

      return app.service('butlerAddresses').create(mockButlerAddress(butler1.id, '2017-05-15'));
    }).then(butlerAddress => {
      butlerAddress2 = butlerAddress;

      return app.service('butlerAddresses').create(mockButlerAddress(butler2.id, '2017-05-01'));
    });
  });

  it('generates individual work days with correct dates (from work blocks)', () => {
    const service = app.service('workDays');

    return Promise.all([
      app.service('workBlocks').create(mockWorkBlock(butler1.id, '2017-05-02')), // Tues
      app.service('workBlocks').create(mockWorkBlock(butler1.id, '2017-05-03')), // Wed
      app.service('workBlocks').create(mockWorkBlock(butler2.id, '2017-05-02')) // Tues
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-05-17'
        }
      });
    }).then(results => {
      expect(results).to.have.lengthOf(8);

      // For butler1 we expect weekly Tuesdays and Wednesdays between 2017-05-01 and 2017-05-17 (incl, excl)
      // For butler2 we expect weekly Tuesdays between 2017-05-01 and 2017-05-17 (incl, excl)
      const butler1expDates = ['2017-05-02', '2017-05-03', '2017-05-09', '2017-05-10', '2017-05-16'];
      const butler2expDates = ['2017-05-02', '2017-05-09', '2017-05-16'];

      const butler1dates = results.filter(r => r.butlerId === butler1.id).map(r => r.date.toString());
      const butler2dates = results.filter(r => r.butlerId === butler2.id).map(r => r.date.toString());

      expect(butler1dates).to.have.members(butler1expDates);
      expect(butler2dates).to.have.members(butler2expDates);
    });
  });

  it('selects work days for a given butler', () => {
    const service = app.service('workDays');

    return Promise.all([
      app.service('workBlocks').create(mockWorkBlock(butler1.id, '2017-05-02')), // Tues
      app.service('workBlocks').create(mockWorkBlock(butler2.id, '2017-05-03')) // Wed
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-05-17',
          butlerId: butler1.id
        }
      });
    }).then(results => {
      // For butler1 we expect there to be 3 visits in total: ['2017-05-02', '2017-05-09', '2017-05-16']
      expect(results).to.have.lengthOf(3);
      expect(results.filter(r => r.butlerId === butler1.id)).to.have.lengthOf(3);
    });
  });

  it('correctly joins active butler address for given generated work day date', () => {
    const service = app.service('workDays');

    return Promise.all([
      app.service('workBlocks').create(mockWorkBlock(butler1.id, '2017-05-01')) // Mon
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-05-17'
        }
      });
    }).then(results => {

      // We expect a change in address on 2017-05-15
      const expectedAddresses = [butlerAddress1.id, butlerAddress1.id, butlerAddress2.id];

      const joinedAddresses = results.map(r => r.butlerAddressId);

      expect(joinedAddresses).to.have.ordered.members(expectedAddresses);
    });
  });
});
