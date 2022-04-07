const assert = require('assert');
const app = require('../../src/app');

describe('\'bulters-first-visit\' service', () => {
  it('registered the service', () => {
    const service = app.service('bulters-first-visit');

    assert.ok(service, 'Registered the service');
  });
});
