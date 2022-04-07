const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const serializeRange = require('../../hooks/serialize-range');
const deserializeRange = require('../../hooks/deserialize-range');
const { butlerPauseSchema } = require('../../models/butler-pauses.model');
const parseDbConstraintError = require('../../hooks/parse-db-constraint-error');
const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

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

const validate = [...butlerPauseSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [...validate, attachTimeStamp, serializeRange(dateRangeOpts)],
    update: [...validate, serializeRange(dateRangeOpts)],
    patch: [...validate, serializeRange(dateRangeOpts)],
    remove: []
  },

  after: {
    all: [deserializeRange(dateRangeOpts)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [parseDbConstraintError(dbErrorParseRules)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
