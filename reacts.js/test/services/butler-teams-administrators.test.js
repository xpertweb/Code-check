const assert = require('assert');
const app = require('../../src/app');

describe('\'butlerTeamsAdministrators\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlerTeamsAdministrators');

    assert.ok(service, 'Registered the service');
  });
});
