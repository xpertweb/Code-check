const assert = require('assert');
const app = require('../../src/app');

describe('\'butlerTeams\' service', () => {
  it('registered the service', () => {
    const service = app.service('butler-teams');

    assert.ok(service, 'Registered the service');
  });
});
