const { authenticate } = require('@feathersjs/authentication').hooks;
const roleShouldBe = require('../../hooks/role-should-be');

const restrict = [
  authenticate('jwt')
];

module.exports = {
  before: {
    all: [...restrict],
    find: [roleShouldBe('client')],
    get: [],
    create: [],
    patch: [],
    update: [],
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
