const chai = require('chai');
const expect = chai.expect;

const resolveUserRoles = require('../../src/hooks/resolve-user-roles');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

describe('\'resolveUserRoles\' hook', () => {
  let app;

  beforeEach(() => {
    const clientsStore = { '0': { id: 0 } };
    const butlersStore = { '1': { id: 1 }, '3': { id: 3 } };
    const operatorsStore = { '2': { id: 2 }, '3': { id: 3 } };

    app = feathers()
      .use('clients', memory({ store: clientsStore }))
      .use('butlers', memory({ store: butlersStore }))
      .use('operators', memory({ store: operatorsStore }));
  });

  it('adds \'roles\'=>\'client\' field to returned user identity that is a client', () => {
    const mock = {
      app: app,
      result: { id: 0 }
    };

    const hook = resolveUserRoles();

    return hook(mock).then(result => {
      expect(result.result.roles).to.have.members(['client']);
    });
  });

  it('adds \'roles\'=>\'butler\' field to returned user identity that is a butler', () => {
    const mock = {
      app: app,
      result: { id: 1 }
    };

    const hook = resolveUserRoles();

    return hook(mock).then(result => {
      expect(result.result.roles).to.have.members(['butler']);
    });
  });

  it('adds \'roles\'=>\'operator\' field to returned user identity that is an operator', () => {
    const mock = {
      app: app,
      result: { id: 2 }
    };

    const hook = resolveUserRoles();

    return hook(mock).then(result => {
      expect(result.result.roles).to.have.members(['operator']);
    });
  });

  it('adds correct roles fields to batch of user identities', () => {
    const mock = {
      app: app,
      result: [{ id: 0 }, { id: 1 }, { id: 2 }]
    };

    const hook = resolveUserRoles();

    return hook(mock).then(result => {
      expect(result.result[0].roles).to.have.members(['client']);
      expect(result.result[1].roles).to.have.members(['butler']);
      expect(result.result[2].roles).to.have.members(['operator']);
    });
  });

  it('adds multiple roles to single user identities that have multiple user types', () => {
    const mock = {
      app: app,
      result: { id: 3 }
    };

    const hook = resolveUserRoles();

    return hook(mock).then(result => {
      expect(result.result.roles).to.have.members(['butler', 'operator']);
    });
  });
});
