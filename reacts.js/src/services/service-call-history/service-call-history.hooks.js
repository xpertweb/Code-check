const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { serviceCallHistorySchema } = require('../../models/service-call-history.model');

const validate = [ ...serviceCallHistorySchema.hooks ];

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
