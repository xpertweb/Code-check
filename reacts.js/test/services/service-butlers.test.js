const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceButlers\' service', () => {
  it('registered the service', () => {
    const service = app.service('serviceButlers');

    assert.ok(service, 'Registered the service');
  });
});
