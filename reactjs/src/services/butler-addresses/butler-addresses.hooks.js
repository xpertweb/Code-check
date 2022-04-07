const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerAddressSchema } = require('../../models/butler-addresses.model');
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const geocodeAddress = require('../../hooks/geocode-address');
const serializeGeopoint = require('../../hooks/serialize-geopoint');
const deserializeGeopoint = require('../../hooks/deserialize-geopoint');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'butlerId'
  })
];

const validate = [ ...butlerAddressSchema.hooks ];

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

module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [
      ...validate,
      attachTimeStamp,
      geocodeAddress(geocoderOpts),
      serializeGeopoint(geopointSzOpts)
    ],
    update: [
      ...validate,
      geocodeAddress(geocoderOpts),
      serializeGeopoint(geopointSzOpts)
    ],
    patch: [
      ...validate,
      geocodeAddress(geocoderOpts),
      serializeGeopoint(geopointSzOpts)
    ],
    remove: []
  },

  after: {
    all: [ deserializeGeopoint(geopointSzOpts) ],
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
