const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceChurnsSchema } = require('../../models/service-churns.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const calculateActiveClientsForAllButlers = require('./hooks/calculate-active-clients-for-all-butlers');
const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];
const servicesEntityModifier  = require('../helpers/modifier-operators')

const validate = [...serviceChurnsSchema.hooks];

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [...validate, servicesEntityModifier()],
    update: [...validate, servicesEntityModifier()],
    patch: [...validate, servicesEntityModifier()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [calculateActiveClientsForAllButlers(false)],
    update: [calculateActiveClientsForAllButlers(false)],
    patch: [],
    remove: [calculateActiveClientsForAllButlers(true)]
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
