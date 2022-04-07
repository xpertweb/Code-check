const assert = require('assert');
const app = require('../../src/app');

describe('\'allocations\' service', () => {
  it('registered the service', () => {
    const service = app.service('allocations');

    assert.ok(service, 'Registered the service');
  });
});
