const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const { churnPerClientSettings } = require('../../models/churn-per-client-settings.model');

const validate = [ ...churnPerClientSettings.hooks ];

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
    find: [],
    get: [],
    create: [...validate ],
    update: [...validate ],
    patch: [...validate ],
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
