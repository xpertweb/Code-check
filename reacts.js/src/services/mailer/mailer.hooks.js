const { mailerSchema } = require('../../models/mailer.model');

const validate = [ ...mailerSchema.hooks ];

const { disallow } = require('feathers-hooks-common');

const restrict = [
  disallow('external'),
];

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [...validate],
    update: [...validate],
    patch: [...validate],
    remove: []
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
