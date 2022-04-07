const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { disallow } = require('feathers-hooks-common');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [disallow('external')],
    update: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external')]
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
