const assert = require('assert');
const app = require('../../src/app');

describe('\'servicePauses\' service', () => {
  it('registered the service', () => {
    const service = app.service('servicePauses');

    assert.ok(service, 'Registered the service');
  });
});
