const { authenticate } = require('@feathersjs/authentication').hooks;
const roleShouldBe = require('../../hooks/role-should-be');



// ...restrict
module.exports = {
  before: {
    all: [authenticate('jwt'), roleShouldBe('operator')],
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
