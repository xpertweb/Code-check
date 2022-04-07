const assert = require('assert');
const app = require('../../src/app');

describe('\'churned-clients-for-lead-pool\' service', () => {
  it('registered the service', () => {
    const service = app.service('churned-clients-for-lead-pool');

    assert.ok(service, 'Registered the service');
  });
});
