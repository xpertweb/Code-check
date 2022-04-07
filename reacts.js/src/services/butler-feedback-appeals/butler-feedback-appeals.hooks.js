const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerFeedbackAppealsSchema } = require("../../models/butler-feedback-appeals.model")
const roleShouldBe = require('../../hooks/role-should-be');
const checkDuplicateAppeal = require('../../hooks/check-duplicate-feedback-appeal')

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [roleShouldBe('butler', 'operator')],
    create: [
      roleShouldBe('butler', 'operator'),
      ...butlerFeedbackAppealsSchema.hooks,
      checkDuplicateAppeal()
    ],
    patch: [roleShouldBe('operator'),],
    remove: [roleShouldBe('butler', 'operator'),]
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
