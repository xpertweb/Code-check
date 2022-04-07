const assert = require('assert');
const app = require('../../src/app');

describe('\'butler-churns-custom\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlerChurnsCustom');

    assert.ok(service, 'Registered the service');
  });
});
