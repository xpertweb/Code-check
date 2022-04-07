const assert = require('assert');
const app = require('../../src/app');

describe('\'legacyItems\' service', () => {
  it('registered the service', () => {
    const service = app.service('legacyItems');

    assert.ok(service, 'Registered the service');
  });
});
