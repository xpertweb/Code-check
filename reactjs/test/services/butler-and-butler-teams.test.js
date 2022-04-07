const assert = require('assert');
const app = require('../../src/app');

describe('\'butlerAndButlerTeams\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlerAndButlerTeams');

    assert.ok(service, 'Registered the service');
  });
});
