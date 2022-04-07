const assert = require('assert');
const app = require('../../src/app');

describe('\'butlerAddresses\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlerAddresses');

    assert.ok(service, 'Registered the service');
  });
});
