const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const allowOperatorAllOrClientSelf = require('../../permissions/allow-operator-all-or-client-self');

const restrict = [
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

module.exports  = () => {
  return {
    before: {
      all: [authenticate('jwt')],
      find: [...allowOperatorAllOrClientSelf('clientId')],
      get: [...restrict],
      create: [],
      update: [...allowOperatorAllOrClientSelf('clientId')],
      patch: [...allowOperatorAllOrClientSelf('clientId')],
      remove: [...allowOperatorAllOrClientSelf('clientId')]
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
