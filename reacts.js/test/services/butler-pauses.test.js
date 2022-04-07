const assert = require('assert');
const app = require('../../src/app');

describe('\'butlerPauses\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlerPauses');

    assert.ok(service, 'Registered the service');
  });
});
