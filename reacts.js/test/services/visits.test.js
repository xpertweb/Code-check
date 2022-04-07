const { expect } = require('chai');
const app = require('../../src/app');
const {
  cleanDb,
  mockClient,
  mockButler,
  mockService,
  mockServicePause,
  mockServiceButler,
  mockServiceAddress,
  mockVisitPlan
} = require('../_utils');

// Integration tests for visits service

describe('\'visits\' service', function () {
  this.timeout(20000);
  let server, client1, client2, butler1, butler2, service1, service2, serviceAddress1, serviceAddress2;

  before(done => {
    server = app.listen(3031);
    server.once('listening', () => done());
  });

  after(done => {
    server.close(done);
  });

  beforeEach(() => {
    return cleanDb(app).then(() => {
      return app.service('clients').create(mockClient());
    }).then(client => {
      client1 = client;

      return app.service('clients').create(mockClient());
    }).then(client => {
      client2 = client;

      return app.service('butlers').create(mockButler());
    }).then(butler => {
      butler1 = butler;

      return app.service('butlers').create(mockButler());
    }).then(butler => {
      butler2 = butler;

      return app.service('services').create(mockService(client1.id));
    }).then(service => {
      service1 = service;

      return app.service('services').create(mockService(client2.id));
    }).then(service => {
      service2 = service;

      return app.service('serviceButlers').create(mockServiceButler(service1.id, butler1.id, '2017-05-01'));
    }).then(() => {
      return app.service('serviceButlers').create(mockServiceButler(service1.id, butler2.id, '2017-05-15'));
    }).then(() => {
      return app.service('serviceButlers').create(mockServiceButler(service2.id, butler1.id, '2017-05-01'));
    }).then(() => {
      return app.service('serviceAddresses').create(mockServiceAddress(service1.id, '2017-05-01'));
    }).then(serviceAddress => {
      serviceAddress1 = serviceAddress;

      return app.service('serviceAddresses').create(mockServiceAddress(service1.id, '2017-05-15'));
    }).then(serviceAddress => {
      serviceAddress2 = serviceAddress;

      return app.service('serviceAddresses').create(mockServiceAddress(service2.id, '2017-05-01'));
    });
  });

  it('generates individual visits with correct dates (from visit plans)', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'n', '2017-05-02')),
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01')),
      app.service('visitPlans').create(mockVisitPlan(service2.id, 'f', '2017-05-01', '2017-06-01'))
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-06-01'
        }
      });
    }).then(results => {
      expect(results).to.have.lengthOf(9);

      // For service1 we expect a one off visit on 2017-05-02 as well as weekly between 2017-05-01 and 2017-06-01
      // For service2 we expect fortnighly visits between 2017-05-01 and 2017-06-01
      const service1expDates = ['2017-05-02', '2017-05-01', '2017-05-08', '2017-05-15', '2017-05-22', '2017-05-29'];
      const service2expDates = ['2017-05-01', '2017-05-15', '2017-05-29'];

      const service1dates = results.filter(r => r.serviceId === service1.id).map(r => r.date.toString());
      const service2dates = results.filter(r => r.serviceId === service2.id).map(r => r.date.toString());

      expect(service1dates).to.have.members(service1expDates);
      expect(service2dates).to.have.members(service2expDates);
    });
  });

  it('selects visits for a given butler', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01')),
      app.service('visitPlans').create(mockVisitPlan(service2.id, 'f', '2017-05-01', '2017-06-01'))
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-06-01',
          butlerId: butler1.id
        }
      });
    }).then(results => {
      // For service1 we expect bulter1 for the first 2 visits and none after
      // For service2 we expect butler1 for all 3 visits
      // In total we are expecting 5 visits
      expect(results).to.have.lengthOf(5);

      expect(results.filter(r => r.serviceId === service1.id)).to.have.lengthOf(2);
      expect(results.filter(r => r.serviceId === service2.id)).to.have.lengthOf(3);
    });
  });

  it('selects visits for a given service', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01')),
      app.service('visitPlans').create(mockVisitPlan(service2.id, 'f', '2017-05-01', '2017-06-01'))
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-06-01',
          serviceId: service1.id
        }
      });
    }).then(results => {
      // For service1 we expect there to be 5 visits in total
      expect(results).to.have.lengthOf(5);
      expect(results.filter(r => r.serviceId === service1.id)).to.have.lengthOf(5);
    });
  });

  it('correctly joins client for given generated visit date', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01')),
      app.service('visitPlans').create(mockVisitPlan(service2.id, 'w', '2017-05-01', '2017-06-01'))
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-06-01'
        }
      });
    }).then(results => {
      expect(results.filter(r => r.serviceId === service1.id && r.clientId === client1.id)).to.have.lengthOf(5);
      expect(results.filter(r => r.serviceId === service2.id && r.clientId === client2.id)).to.have.lengthOf(5);
    });
  });

  it('correctly joins active butler for given generated visit date', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01'))
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-06-01'
        }
      });
    }).then(results => {

      // We expect a change in butler on 2017-05-15
      const expectedButlers = [butler1.id, butler1.id, butler2.id, butler2.id, butler2.id];

      const joinedButlers = results.map(r => r.butlerId);

      expect(joinedButlers).to.have.ordered.members(expectedButlers);
    });
  });

  it('correctly joins active service address for given generated visit date', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01'))
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-06-01'
        }
      });
    }).then(results => {

      // We expect a change in address on 2017-05-15
      const expectedAddresses = [serviceAddress1.id, serviceAddress1.id, serviceAddress2.id, serviceAddress2.id, serviceAddress2.id];

      const joinedAddresses = results.map(r => r.serviceAddressId);

      expect(joinedAddresses).to.have.ordered.members(expectedAddresses);
    });
  });

  it('generates visits within given date window', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01')),
      app.service('visitPlans').create(mockVisitPlan(service2.id, 'f', '2017-05-01', '2017-06-01')),
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'n', '2017-05-12')), // Should be excluded
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'n', '2017-05-22')) // Should be excluded
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-13',
          endDate: '2017-05-22'
        }
      });
    }).then(results => {
      // For service1 we expect only one visit on the 15th
      // For service2 we expect only one visit on the 15th (likewise)
      // NOTE: The query end date is supposed to be non-inclusive as usual
      // in this sytem, so the 22nd is always excluded
      const service1expDates = ['2017-05-15'];
      const service2expDates = ['2017-05-15'];

      const service1dates = results.filter(r => r.serviceId === service1.id).map(r => r.date.toString());
      const service2dates = results.filter(r => r.serviceId === service2.id).map(r => r.date.toString());

      expect(service1dates).to.have.members(service1expDates);
      expect(service2dates).to.have.members(service2expDates);
    });
  });

  it('excludes visits within service pause ranges', () => {
    const service = app.service('visits');

    return Promise.all([
      app.service('visitPlans').create(mockVisitPlan(service1.id, 'w', '2017-05-01', '2017-06-01')),
      app.service('visitPlans').create(mockVisitPlan(service2.id, 'w', '2017-05-01', '2017-06-01')), // should be no pauses applied
      app.service('servicePauses').create(mockServicePause(service1.id, '2017-05-01', '2017-05-02')), // pause on the 1st
      app.service('servicePauses').create(mockServicePause(service1.id, '2017-05-15')) // pause on the 15th onwards
    ]).then(() => {
      return service.find({
        query: {
          startDate: '2017-05-01',
          endDate: '2017-06-01'
        }
      });
    }).then(results => {
      // For service1 we expect only one visit on the 8th
      // For service2 we expect all visits (5 total)
      // NOTE: The query end date is supposed to be non-inclusive as usual
      // in this sytem, so the 22nd is always excluded
      const service1expDates = ['2017-05-08'];
      const service2expDates = ['2017-05-01', '2017-05-08', '2017-05-15', '2017-05-22', '2017-05-29'];

      const service1dates = results.filter(r => r.serviceId === service1.id).map(r => r.date.toString());
      const service2dates = results.filter(r => r.serviceId === service2.id).map(r => r.date.toString());

      expect(service1dates).to.have.members(service1expDates);
      expect(service2dates).to.have.members(service2expDates);
    });
  });
});
