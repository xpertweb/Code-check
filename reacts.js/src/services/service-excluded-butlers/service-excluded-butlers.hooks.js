const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceExcludedButlerSchema } = require('../../models/service-excluded-butlers.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const {
  populate,
  fastJoin,
  makeCallingParams
} = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');
const { getResultsByKey, getUniqueKeys } = BatchLoader;
const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];
const servicesEntityModifier  = require('../helpers/modifier-operators')

const validate = [...serviceExcludedButlerSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [...validate, attachTimeStamp, servicesEntityModifier()],
    update: [...validate, servicesEntityModifier()],
    patch: [...validate, servicesEntityModifier()],
    remove: []
  },
  after: {
    all: [],
    find: [
      fastJoin({
        before: context => {
          context._loaders = { butler: {} };
          context._loaders.butler.id = new BatchLoader(
            async (keys, context) => {
              const result = await context.app.service('/butlers').find(
                makeCallingParams(context, {
                  id: { $in: getUniqueKeys(keys) }
                }),
                undefined,
                { paginate: false }
              );
              return getResultsByKey(keys, result, butler => butler.id, '!');
            },
            { context }
          );
        },
        joins: {
          butler: () => async (serviceButler, context) => {
            serviceButler.butler = await context._loaders.butler.id.load(
              serviceButler.butlerId
            );
          }
        }
      })
    ],
    get: [
      populate({
        schema: {
          include: {
            service: 'butlers',
            nameAs: 'butler',
            parentField: 'butlerId',
            childField: 'id',
            provider: undefined
          }
        }
      })
    ],
    create: [
      populate({
        schema: {
          include: {
            service: 'butlers',
            nameAs: 'butler',
            parentField: 'butlerId',
            childField: 'id',
            provider: undefined
          }
        }
      })
    ],
    update: [
      populate({
        schema: {
          include: {
            service: 'butlers',
            nameAs: 'butler',
            parentField: 'butlerId',
            childField: 'id',
            provider: undefined
          }
        }
      })
    ],
    patch: [
      populate({
        schema: {
          include: {
            service: 'butlers',
            nameAs: 'butler',
            parentField: 'butlerId',
            childField: 'id',
            provider: undefined
          }
        }
      })
    ],
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
