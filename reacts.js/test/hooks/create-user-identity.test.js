const expect = require('chai').expect;
const createUserIdentity = require('../../src/hooks/create-user-identity');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

describe('\'createUserIdentity\' hook', () => {
  it('creates a user identity and injects id into request data', () => {
    const app = feathers()
      .use('userIdentities', memory({ startId: 7 }));

    const mock = {
      app: app,
      method: 'create',
      data: {}
    };
    const hook = createUserIdentity();

    return hook(mock).then(result => {
      expect(result.data.id).to.equal(7);

      return app.service('userIdentities').get(7);
    }).then(userIdentity => {
      expect(userIdentity.id).to.equal(7);
    });
  });
});
