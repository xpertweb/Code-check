const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceAddresses\' service', () => {
  it('registered the service', () => {
    const service = app.service('serviceAddresses');

    assert.ok(service, 'Registered the service');
  });
});
