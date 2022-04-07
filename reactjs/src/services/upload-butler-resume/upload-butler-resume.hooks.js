const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const loadUserSendingRequest = require('../../hooks/load-user-sending-request');

const roleRestrict = restrictToRoles({
  roles: ['operator','butler'],
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
    find: [...restrict],
    get: [...restrict],
    create: [...restrict,loadUserSendingRequest()],
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
