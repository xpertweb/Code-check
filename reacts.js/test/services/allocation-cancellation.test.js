const assert = require('assert');
const app = require('../../src/app');

describe('\'allocationCancellation\' service', () => {
  it('registered the service', () => {
    const service = app.service('allocationCancellation');

    assert.ok(service, 'Registered the service');
  });
});
