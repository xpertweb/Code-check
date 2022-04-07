const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const { serviceSchema } = require('../../models/services.model');
const augmentFindQuery = require('../../hooks/augment-find-query');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'clientId'
  })
];

const validate = [ ...serviceSchema.hooks ];

function overwriteServiceLine(hook) {
  const {furnitureAssemblyRequired=false,packingServiceRequired=false,gardeningServiceRequired=false} = hook.data;
  if (furnitureAssemblyRequired){
    hook.data.serviceLine = 'furniture_assembly';
  }
  else if(packingServiceRequired){
    hook.data.serviceLine = 'packing_service';
  }
  else if(gardeningServiceRequired){
    hook.data.serviceLine = 'gardening';
  }
  return hook;
}



function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}



module.exports = {
  before: {
    all: [ ...restrict ],
    find: [augmentFindQuery([
      {
        type: 'leftJoin',
        with: 'clients',
        localId: 'clientId',
        foreignId: 'id',
        asPrefix: 'client',
        select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
      },
      {
        type: 'temporalJoin',
        with: 'serviceAddresses',
        localId: 'id',
        foreignId: 'serviceId',
        asPrefix: 'address',
        select: ['id', 'line1', 'line2', 'locale', 'state', 'postcode', 'country','closestBusStop','closestTrainStation','closestTramStation','closestGeoPoints'],
        instantField: 'activeFrom'
      },
      {
        type: 'temporalJoin',
        with: 'butlers',
        through: 'serviceButlers',
        throughTableSelect: ['dateTimeCreated'],
        localId: 'id',
        throughForeignId: 'serviceId',
        throughLocalId: 'butlerId',
        foreignId: 'id',
        asPrefix: 'butler',
        select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber','activeClients', 'rating'],
        instantField: 'activeFrom'
      }
    ])],
    get: [],
    create: [ ...validate, attachTimeStamp, overwriteServiceLine ],
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
