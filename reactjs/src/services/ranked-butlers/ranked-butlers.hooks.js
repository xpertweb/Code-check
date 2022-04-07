const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const { disallow } = require('feathers-hooks-common');
const getManagedScheduleButlers = require('./hooks/get-managed-schedule-butlers');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'butlerId'
  })
];

module.exports = {
  before: {
    all: [],
    find: [...restrict, getManagedScheduleButlers()],
    get: [ disallow() ],
    create: [ disallow() ],
    update: [ ...restrict],
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
