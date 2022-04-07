const assert = require('assert');
const app = require('../../src/app');

describe('\'butlers\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlers');

    assert.ok(service, 'Registered the service');
  });
});
