const { authenticate } = require('@feathersjs/authentication').hooks;
const loadUserSendingRequest = require('../../hooks/load-user-sending-request');
const { disallow } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');

const restrict = [
  authenticate('jwt'),
  checkPermissions({
    roles: ['operator','butler'],
    field: 'role',
    error: false
  })
];

module.exports = {
  before: {
    all: [...restrict],
    find: [loadUserSendingRequest()],
    get: [ disallow() ],
    create: [disallow()],
    update: [ disallow() ],
    patch: [ disallow() ],
    remove: [ disallow() ]
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
