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
    all: [...restrict],
    find: [],
    get: [],
    create: [ ],
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
