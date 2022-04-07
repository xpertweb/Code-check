const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator']
  })
];

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
