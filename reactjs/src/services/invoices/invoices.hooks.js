const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const { disallow } = require('feathers-hooks-common');
const deserializeRange = require('../../hooks/deserialize-range');

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

const intervalOpts = {
  intervalField: 'duration',
  serializedField: 'duration'
};

const geopointSzOpts = {
  geopointField: 'geopoint',
  serializedField: 'geopoint'
};

module.exports = {
  before: {
    all: [],
    find: [ ...restrict ],
    get: [ ],
    create: [ disallow() ],
    update: [ disallow() ],
    patch: [ disallow() ],
    remove: [ disallow() ]
  },

  after: {
    all: [ ],
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
