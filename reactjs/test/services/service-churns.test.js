const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceChurns\' service', () => {
  it('registered the service', () => {
    const service = app.service('serviceChurns');

    assert.ok(service, 'Registered the service');
  });
});
