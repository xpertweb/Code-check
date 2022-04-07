const { authenticate } = require('@feathersjs/authentication').hooks;
const { visitModificationRequestsSchema } = require('../../models/visit-modification-requests.model');
const roleShouldBe = require('../../hooks/role-should-be');
const checkDuplicateRequest = require('../../hooks/check-duplicate-visit-modification-request');
const loadUserSendingRequest = require('../../hooks/load-user-sending-request');

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [roleShouldBe('client', 'operator')],
    get: [roleShouldBe('client', 'operator')],
    create: [
      roleShouldBe('client'),
      attachTimeStamp,
      ...visitModificationRequestsSchema.hooks,
      checkDuplicateRequest(),
      loadUserSendingRequest()

    ],
    patch: [roleShouldBe('client', 'operator')],
    remove: [roleShouldBe('operator')]
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
