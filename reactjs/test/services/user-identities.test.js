const assert = require('assert');
const app = require('../../src/app');

describe('\'userIdentities\' service', () => {
  it('registered the service', () => {
    const service = app.service('userIdentities');

    assert.ok(service, 'Registered the service');
  });
});
