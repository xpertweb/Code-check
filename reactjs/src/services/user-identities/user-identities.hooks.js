const { disallow } = require('feathers-hooks-common');
const resolveUserRoles = require('../../hooks/resolve-user-roles');

module.exports = {
  before: {
    all: [ disallow('external') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ resolveUserRoles() ],
    get: [ resolveUserRoles() ],
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
