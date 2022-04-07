const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceTasks\' service', () => {
  it('registered the service', () => {
    const service = app.service('serviceTasks');

    assert.ok(service, 'Registered the service');
  });
});
