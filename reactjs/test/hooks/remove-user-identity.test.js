const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const removeUserIdentity = require('../../src/hooks/remove-user-identity');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

describe('\'removeUserIdentity\' hook', () => {
  it('removes an associated user identity equivalent to result id', () => {
    const store = {
      '7': { id: 7 }
    };
    const app = feathers()
      .use('userIdentities', memory({ store: store }));

    const userIdentities = app.service('userIdentities');

    const mock = {
      app: app,
      method: 'remove',
      result: { id: 7 }
    };
    const hook = removeUserIdentity();

    return hook(mock).then(result => {
      expect(result.result.id).to.equal(7);

      return expect(userIdentities.get(7)).to.be.rejected;
    });
  });
});
