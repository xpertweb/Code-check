const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const {
  serviceMarketingSchema
} = require('../../models/service-marketing.model');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [...serviceMarketingSchema.hooks];

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [...validate],
    update: [...validate],
    patch: [...validate],
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
