const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
// const { operatorsToDoItemsSchema } = require('../../models/operators-to-do-items.model');
const servicesEntityModifier  = require('../helpers/modifier-operators')
function attachTimeStamp(hook) {
  hook.data.createdDateTime = new Date();
  return hook;
}

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['operator'],
    idField: 'id',
    ownerField: 'id'
  })
];
module.exports = (app) => {
  return {
    before: {
      all: [],
      find: [...restrict],
      get: [...restrict],
      create: [...restrict,attachTimeStamp, servicesEntityModifier()],
      update: [...restrict,servicesEntityModifier()],
      patch: [...restrict,servicesEntityModifier()],
      remove: [...restrict]
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
  }
};
