const assert = require('assert');
const app = require('../../src/app');

describe('\'allocations-with-extra-pay\' service', () => {
  it('registered the service', () => {
    const service = app.service('allocations-with-extra-pay');

    assert.ok(service, 'Registered the service');
  });
});
