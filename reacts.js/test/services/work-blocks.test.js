const assert = require('assert');
const app = require('../../src/app');

describe('\'workBlocks\' service', () => {
  it('registered the service', () => {
    const service = app.service('workBlocks');

    assert.ok(service, 'Registered the service');
  });
});
