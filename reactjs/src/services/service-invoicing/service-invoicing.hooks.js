const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');

const {
  serviceInvoicingSchema
} = require('../../models/service-invoicing.model');

const restrict = [authenticate('jwt')];

const allowedOperatorOnly = restrictToRoles({idField: 'id', roles: ['operator']});

const allowedBothOperatorAndClient = restrictToRoles({ idField: 'id', roles: ['operator','client']});

const joinQueryForClientCall = require('./hooks/join-service-hook');

const preventFields = require('./hooks/prevent-fields-from-client-hook');

const validate = [...serviceInvoicingSchema.hooks];

module.exports = {
  before: {
    all: [...restrict],
    find: [allowedBothOperatorAndClient,joinQueryForClientCall()],
    get: [allowedOperatorOnly],
    create: [allowedOperatorOnly,...validate],
    update: [allowedOperatorOnly,...validate],
    patch: [allowedBothOperatorAndClient,...validate,preventFields()],
    remove: [allowedOperatorOnly]
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
