const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceAddressSchema, serviceAddressSchemaOnCreate } = require('../../models/service-addresses.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const geocodeAddress = require('../../hooks/geocode-address');
const closestAddress = require('../../hooks/closest-address');
const serializeGeopoint = require('../../hooks/serialize-geopoint');
const deserializeGeopoint = require('../../hooks/deserialize-geopoint');
const messageToNearByButlers = require('../../hooks/message-to-nearby-butlers');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [ ...serviceAddressSchema.hooks ];
const validateOnCreate = [ ...serviceAddressSchemaOnCreate.hooks ];

const geocoderOpts = {
  addressFields: ['line1', 'line2', 'locale', 'state', 'country', 'postcode'],
  resultField: 'geopoint'
};

const geopointSzOpts = {
  geopointField: 'geopoint',
  serializedField: 'geopoint'
};

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

function changeNeedsToBeAllocatedDataHookToParams(hook){
  hook.params.needsToBeAllocated = hook.data.needsToBeAllocated;
  hook.params.needsToBeAllocatedByEmail = hook.data.needsToBeAllocatedByEmail;
  delete hook.data.needsToBeAllocated;
  delete hook.data.needsToBeAllocatedByEmail;
}



module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [
      ...validateOnCreate,
      attachTimeStamp,
      geocodeAddress(geocoderOpts),
      closestAddress(geocoderOpts),
      serializeGeopoint(geopointSzOpts),
      changeNeedsToBeAllocatedDataHookToParams
    ],
    update: [
      ...validate,
      geocodeAddress(geocoderOpts),
      closestAddress(geocoderOpts),
      serializeGeopoint(geopointSzOpts)
    ],
    patch: [
      ...validate,
      geocodeAddress(geocoderOpts),
      closestAddress(geocoderOpts),
      serializeGeopoint(geopointSzOpts)
    ],
    remove: []
  },

  after: {
    all: [ deserializeGeopoint(geopointSzOpts) ],
    find: [],
    get: [],
    create: [messageToNearByButlers()],
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
