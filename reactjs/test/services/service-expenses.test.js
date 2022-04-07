const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceExpenses\' service', () => {
  it('registered the service', () => {
    const service = app.service('serviceExpenses');

    assert.ok(service, 'Registered the service');
  });
});
