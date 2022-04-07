const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const servicesEntityModifier  = require('../helpers/modifier-operators')

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'serviceId'
  })
];

module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [attachTimeStamp, servicesEntityModifier()],
    update: [attachTimeStamp, servicesEntityModifier()],
    patch: [attachTimeStamp, servicesEntityModifier()],
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
