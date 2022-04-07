const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerDisputesSchema } = require("../../models/butler-disputes.model")
const roleShouldBe = require('../../hooks/role-should-be');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [roleShouldBe('operator')],
    get: [roleShouldBe('butler')],
    create: [
      roleShouldBe('butler', 'operator'),
      ...butlerDisputesSchema.hooks
    ],
    patch: [roleShouldBe('operator')],
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
