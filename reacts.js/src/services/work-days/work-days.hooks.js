const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const deserializeRange = require('../../hooks/deserialize-range');
const deserializeGeopoint = require('../../hooks/deserialize-geopoint');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'butlerId'
  })
];

const timeRangeOpts = {
  lowerBoundField: 'windowStartTime',
  upperBoundField: 'windowEndTime',
  serializedField: 'timeWindow'
};

const geopointSzOpts = {
  geopointField: 'butlerAddressGeopoint',
  serializedField: 'butlerAddressGeopoint'
};

module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      deserializeRange(timeRangeOpts),
      deserializeGeopoint(geopointSzOpts)
    ],
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
