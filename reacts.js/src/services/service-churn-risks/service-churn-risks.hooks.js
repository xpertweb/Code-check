const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const {
  serviceChurnRiskSchema
} = require('../../models/service-churn-risks.model');
const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [...serviceChurnRiskSchema.hooks];

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
