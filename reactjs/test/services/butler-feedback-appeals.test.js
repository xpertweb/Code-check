const assert = require('assert');
const app = require('../../src/app');

describe('\'butler-feedback-appeals\' service', () => {
  it('registered the service', () => {
    const service = app.service('butlerFeedbackAppeals');

    assert.ok(service, 'Registered the service');
  });
});
