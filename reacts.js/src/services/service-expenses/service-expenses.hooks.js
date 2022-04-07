const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceExpenseSchema } = require('../../models/service-expenses.model');
const { restrictToRoles } = require('feathers-authentication-hooks');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [ ...serviceExpenseSchema.hooks ];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}


module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [ ...validate, attachTimeStamp ],
    update: [ ...validate ],
    patch: [ ...validate ],
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
