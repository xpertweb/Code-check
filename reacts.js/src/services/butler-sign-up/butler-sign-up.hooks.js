const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');

const roleRestrict = restrictToRoles({
  roles: ['operator'],
  idField: 'id',
  ownerField: 'id',
});

const restrict = [
  authenticate('jwt'),
  roleRestrict
];


module.exports = {
  before: {
    all: [],
    find: [],
    get: [...restrict],
    create: [],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict]
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
