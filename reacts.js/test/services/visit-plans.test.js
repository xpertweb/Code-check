const assert = require('assert');
const app = require('../../src/app');

describe('\'visitPlans\' service', () => {
  it('registered the service', () => {
    const service = app.service('visitPlans');

    assert.ok(service, 'Registered the service');
  });
});
