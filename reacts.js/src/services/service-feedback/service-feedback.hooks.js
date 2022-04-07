const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceFeedbackSchema } = require('../../models/service-feedback.model');
const calculateButlerRating = require('./hooks/calculate-butler-rating.hook');
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const allowOperatorAllOrButlerSelf = require('../../permissions/allow-operator-all-or-butler-self');
const onlyPublicFeedbackForButler = require('./hooks/only-public-feedback-for-butler.hook');
const servicesEntityModifier  = require('../helpers/modifier-operators')

const {
  populate,
  fastJoin,
  makeCallingParams
} = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');
const { getResultsByKey, getUniqueKeys } = BatchLoader;

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'butlerId'
  })
];

const validate = [...serviceFeedbackSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [],
    find: [
      ...allowOperatorAllOrButlerSelf('butlerId'),
      onlyPublicFeedbackForButler()],
    get: [...restrict],
    create: [...restrict, ...validate, attachTimeStamp, servicesEntityModifier()],
    update: [...restrict, ...validate, servicesEntityModifier()],
    patch: [...restrict, ...validate, servicesEntityModifier()],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [
      fastJoin({
        before: context => {
          context._loaders = { butler: {}, service: {}, feedbackAppeal:{} };
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
          context._loaders.service.id = new BatchLoader(
            async (keys, context) => {
              const result = await context.app.service('/services').find({
                query: {
                  id: {
                    $in: keys
                  }
                }
              },
              undefined,
              { paginate: false }
              );
              return getResultsByKey(keys, result, service => service.id, '!');
            },
            { context }
          );
        },
        joins: {
          butler: () => async (serviceFeedback, context) => {
            serviceFeedback.butler = await context._loaders.butler.id.load(
              serviceFeedback.butlerId
            );
          },
          service: () => async (serviceFeedback, context) => {
            serviceFeedback.service = await context._loaders.service.id.load(
              serviceFeedback.serviceId
            );
          },
          feedbackAppeal: () => async (serviceFeedback, context) => {
            const result = await context.app.settings.knexClient('butlerFeedbackAppeals').where('feedbackId', serviceFeedback.id)
            serviceFeedback.feedbackAppeal = result && result[0]
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
      }),
      calculateButlerRating()
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
      }),
      calculateButlerRating()
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
          },
          include: {
            service: 'services',
            nameAs: 'service',
            parentField: 'serviceId',
            childField: 'id',
            provider: undefined
          }
        }
      }),
      calculateButlerRating()
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
