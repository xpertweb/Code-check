const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceButlerNoShowSchema } = require('../../models/service-butler-no-show.model');
const { restrictToRoles } = require('feathers-authentication-hooks');

const { fastJoin } = require('feathers-hooks-common');


const BatchLoader = require('@feathers-plus/batch-loader');
const { getResultsByKey, getUniqueKeys } = BatchLoader;
const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [...serviceButlerNoShowSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = (app)=> {
  const postResolvers = {
    joins: {
      butler: (...args) => async post => {
        post.butler = (await app.service('butlers').get(post.butlerId))
      },
    }
  };
  return {
    before: {
      all: [],
      find: [],
      get: [...restrict],
      create: [...restrict, ...validate, attachTimeStamp],
      update: [...restrict, ...validate],
      patch: [...restrict, ...validate],
      remove: [...restrict]
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
