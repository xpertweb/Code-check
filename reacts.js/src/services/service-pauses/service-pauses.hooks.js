const { authenticate } = require('@feathersjs/authentication').hooks;
const { servicePauseSchema } = require('../../models/service-pauses.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const serializeRange = require('../../hooks/serialize-range');
const deserializeRange = require('../../hooks/deserialize-range');
const parseDbConstraintError = require('../../hooks/parse-db-constraint-error');
const servicesEntityModifier  = require('../helpers/modifier-operators')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [ ...servicePauseSchema.hooks ];

const dateRangeOpts = {
  lowerBoundField: 'startDate',
  upperBoundField: 'endDate',
  serializedField: 'dateRange'
};

const dbErrorParseRules = [
  {
    constraint: 'nonEmptyDateRange',
    fieldName: 'startDate',
    message: 'Date range cannot be empty'
  }
];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [ ...validate, attachTimeStamp, serializeRange(dateRangeOpts), servicesEntityModifier() ],
    update: [ ...validate, serializeRange(dateRangeOpts), servicesEntityModifier() ],
    patch: [ ...validate, serializeRange(dateRangeOpts), servicesEntityModifier() ],
    remove: []
  },

  after: {
    all: [ deserializeRange(dateRangeOpts) ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ parseDbConstraintError(dbErrorParseRules) ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
