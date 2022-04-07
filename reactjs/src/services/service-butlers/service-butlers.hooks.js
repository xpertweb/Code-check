const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceButlerSchema, serviceButlerSchemaOnCreate } = require('../../models/service-butlers.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const allowOperatorAllOrButlerSelf = require('../../permissions/allow-operator-all-or-butler-self');
const calculateActiveClientsForButler = require('./hooks/calculate-active-clients-for-butler.hook');
const knexnest = require('knexnest');
const servicesEntityModifier  = require('../helpers/modifier-operators');
const messageToNearByButlers = require('../../hooks/message-to-nearby-butlers');
const { resetNoOfRequests } = require('../requested-visits/hooks/set_number_of_VisitPlan.hook');
const updateUrgentFieldsOfParentService = require('./hooks/update-urgent-fields-of-parent-service');

const {
  populate,
  fastJoin,
  makeCallingParams
} = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');
const augmentFindQuery = require('../../hooks/augment-find-query');
const { getResultsByKey, getUniqueKeys } = BatchLoader;
const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [...serviceButlerSchema.hooks];
const validateOnCreate = [...serviceButlerSchemaOnCreate.hooks];


function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}
function checkButlerAllocatedMethod(hook) {
  if(hook.data.butlerAllocatedByMethod == null){
    hook.data.butlerAllocatedByMethod='manual';
  }
  return hook;
}

module.exports = {
  before: {
    all: [],
    find: [
      ...allowOperatorAllOrButlerSelf('butlerId'),
      augmentFindQuery([
        {
          type: 'leftJoin',
          with: 'serviceButlerChurnCategories',
          localId: 'churnReasonId',
          foreignId: 'id',
          asPrefix: 'churnReason',
          select: [
            'id',
            'reason'
          ]
        }
      ])
    ],
    get: [...restrict],
    create: [...restrict,...validateOnCreate, attachTimeStamp, servicesEntityModifier(),messageToNearByButlers(),checkButlerAllocatedMethod,updateUrgentFieldsOfParentService()],
    update: [...restrict,...validate, servicesEntityModifier(),checkButlerAllocatedMethod],
    patch: [...restrict,...validate, servicesEntityModifier(),checkButlerAllocatedMethod],
    remove: [...restrict]
  },
  after: {
    all: [],
    find: [
      fastJoin({
        before: context => {
          context._loaders = { butler: {}, service:{} };
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
              // need to use knex to bypass the existing permission restrictions, services requested below have been previously filtered above so all good
              const serviceQuery = context.app.get('knexClient').select(
                's.id as _id',
                's.pets as _pets',
                's.spraysWipesAndBasicsRequired as _spraysWipesAndBasicsRequired',
                's.mopRequired as _mopRequired',
                's.vacuumRequired as _vacuumRequired',
                'c.id AS _client_id',
                'c.firstName AS _client_firstName',
                'c.lastName AS _client_lastName',
                'c.email AS _client_email',
                'c.phoneNumber AS _client_phoneNumber'
              )
                .from('services AS s')
                .whereIn('s.id',getUniqueKeys(keys))
                .innerJoin('clients AS c', 'c.id', 's.clientId');

              const result = await knexnest(serviceQuery);
              const addresses = await context.app.get('knexClient')('serviceAddresses').whereIn('serviceId',result.map(x=>x.id));
              for (const service of result ){
                //get the latest active address
                service.address = addresses.filter(x=> x.serviceId == service.id && new Date() >= new Date(x.activeFrom)).sort((a,b)=> new Date(b.activeFrom) - new Date(a.activeFrom))[0];
              }
              return getResultsByKey(keys, result, service => service.id, '!');
            },
            { context }
          );
        },
        joins: {
          butler: () => async (serviceButler, context) => {
            serviceButler.butler = await context._loaders.butler.id.load(
              serviceButler.butlerId
            );
          },
          service: () => async (serviceButler, context) => {
            serviceButler.service = await context._loaders.service.id.load(
              serviceButler.serviceId
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
      }),
      calculateActiveClientsForButler(true),
      resetNoOfRequests()
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
      }),
    ],
    remove: [
      calculateActiveClientsForButler(false)
    ]
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
