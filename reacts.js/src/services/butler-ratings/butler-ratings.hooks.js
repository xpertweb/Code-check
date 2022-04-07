const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const loadUserSendingRequest = require('../../hooks/load-user-sending-request');
const { disallow } = require('feathers-hooks-common');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'butlerId'
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
