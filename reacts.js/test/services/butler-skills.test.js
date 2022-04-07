const assert = require('assert');
const app = require('../../src/app');

describe('\'butlerSkills\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlerSkills');

    assert.ok(service, 'Registered the service');
  });
});
