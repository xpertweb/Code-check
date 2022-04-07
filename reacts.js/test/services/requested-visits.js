const assert = require('assert');
const app = require('../../src/app');

describe('\'requestedVisits\' service', () => {
  it('registered the service', () => {
    const service = app.service('requestedVisits');

    assert.ok(service, 'Registered the service');
  });
});
