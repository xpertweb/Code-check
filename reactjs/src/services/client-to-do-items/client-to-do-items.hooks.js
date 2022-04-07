const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const allowOperatorAllOrClientSelf = require('../../permissions/allow-operator-all-or-client-self');
const { fastJoin } = require('feathers-hooks-common');

const restrict = [
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

module.exports = (app) => {

  const postResolvers = {
    joins: {
      pictures: (...args) => async post => {
        post.pictures = (await app.service('clientToDoItemPictures').find({
        query: { clientToDoItemId: post.id },
        paginate: false
      }))},
    }
  };
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
      find: [fastJoin(postResolvers)],
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
