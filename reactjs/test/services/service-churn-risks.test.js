const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceChurnRisks\' service', () => {
  it('registered the service', () => {
    const service = app.service('serviceChurnRisks');

    assert.ok(service, 'Registered the service');
  });
});
