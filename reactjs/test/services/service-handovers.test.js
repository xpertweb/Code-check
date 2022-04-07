const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceHandovers\' service', () => {
  it('registered the service', () => {
    const service = app.service('serviceHandovers');

    assert.ok(service, 'Registered the service');
  });
});
