const chai = require('chai');
const expect = chai.expect;
const populateScheduleAux = require('../../src/services/schedules/hooks/populate-schedule-aux');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

describe('\'populateScheduleAux\' hook', () => {
  const app = feathers()
    .use('/clients', memory({
      name: 'clients',
      store: {
        '1': { id: 1, firstName: 'John' },
        '2': { id: 2, firstName: 'Jane' }
      }
    }))
    .use('/services', memory({
      name: 'services',
      store: {
        '1': { id: 1, notes: 'A note' },
        '2': { id: 2, notes: 'Another note' }
      }
    }))
    .use('/serviceAddresses', memory({
      name: 'serviceAddresses',
      store: {
        '1': { id: 1, locale: 'Melbourne' },
        '2': { id: 2, locale: 'Sydney' }
      }
    }))
    .use('/visitPlans', memory({
      name: 'visitPlans',
      store: {}
    }));

  it('populates clients in anchoredVisits correctly', () => {
    // A mock hook object
    const mock = {
      app: app,
      type: 'after',
      method: 'find',
      params: {},
      result: [{
        anchoredVisits: [
          {
            clientId: 1
          },
          {
            clientId: 2
          }
        ]
      }]
    };

    const hook = populateScheduleAux();

    return hook(mock).then(result => {
      expect(result.result[0].anchoredVisits[0].client).to.deep.equal({ id: 1, firstName: 'John' });
      expect(result.result[0].anchoredVisits[1].client).to.deep.equal({ id: 2, firstName: 'Jane' });
    });
  });

  it('populates services in anchoredVisits correctly', () => {
    // A mock hook object
    const mock = {
      app: app,
      type: 'after',
      method: 'find',
      params: {},
      result: [{
        anchoredVisits: [
          {
            serviceId: 1
          },
          {
            serviceId: 2
          }
        ]
      }]
    };

    const hook = populateScheduleAux();

    return hook(mock).then(result => {
      expect(result.result[0].anchoredVisits[0].service).to.deep.equal({ id: 1, notes: 'A note' });
      expect(result.result[0].anchoredVisits[1].service).to.deep.equal({ id: 2, notes: 'Another note' });
    });
  });

  it('populates service addresses in anchoredVisits correctly', () => {
    // A mock hook object
    const mock = {
      app: app,
      type: 'after',
      method: 'find',
      params: {},
      result: [{
        anchoredVisits: [
          {
            serviceAddressId: 1
          },
          {
            serviceAddressId: 2
          }
        ]
      }]
    };

    const hook = populateScheduleAux();

    return hook(mock).then(result => {
      expect(result.result[0].anchoredVisits[0].serviceAddress).to.deep.equal({ id: 1, locale: 'Melbourne' });
      expect(result.result[0].anchoredVisits[1].serviceAddress).to.deep.equal({ id: 2, locale: 'Sydney' });
    });
  });

  it('only populates a single service (multi service outputs are ignored) if auxMulti is not defined as param', () => {
    // A mock hook object
    const mock = {
      app: app,
      type: 'after',
      method: 'find',
      params: {},
      result: [{
        anchoredVisits: [
          {
            clientId: 1,
            serviceId: 1,
            serviceAddressId: 1
          }
        ]
      }, {
        anchoredVisits: [
          {
            clientId: 1,
            serviceId: 1,
            serviceAddressId: 1
          }
        ]
      }]
    };

    const hook = populateScheduleAux();

    return hook(mock).then(result => {
      expect(result.result[0].anchoredVisits[0].client).to.be.undefined;
      expect(result.result[1].anchoredVisits[0].client).to.be.undefined;
      expect(result.result[0].anchoredVisits[0].services).to.be.undefined;
      expect(result.result[1].anchoredVisits[0].services).to.be.undefined;
      expect(result.result[0].anchoredVisits[0].serviceAddress).to.be.undefined;
      expect(result.result[1].anchoredVisits[0].serviceAddress).to.be.undefined;
    });
  });

  it('populates a multiple services if auxMulti is defined as param', () => {
    // A mock hook object
    const mock = {
      app: app,
      type: 'after',
      method: 'find',
      params: {
        auxMulti: true
      },
      result: [{
        anchoredVisits: [
          {
            clientId: 1,
            serviceId: 1,
            serviceAddressId: 1
          }
        ]
      }, {
        anchoredVisits: [
          {
            clientId: 1,
            serviceId: 1,
            serviceAddressId: 1
          }
        ]
      }]
    };

    const hook = populateScheduleAux();

    return hook(mock).then(result => {
      expect(result.result[0].anchoredVisits[0].client).not.to.be.undefined;
      expect(result.result[1].anchoredVisits[0].client).not.to.be.undefined;
      expect(result.result[0].anchoredVisits[0].service).not.to.be.undefined;
      expect(result.result[1].anchoredVisits[0].service).not.to.be.undefined;
      expect(result.result[0].anchoredVisits[0].serviceAddress).not.to.be.undefined;
      expect(result.result[1].anchoredVisits[0].serviceAddress).not.to.be.undefined;
    });
  });
});
