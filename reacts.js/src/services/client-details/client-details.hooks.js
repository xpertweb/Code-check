const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
//authenticate('jwt')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['operator'],
    idField: 'id'
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
