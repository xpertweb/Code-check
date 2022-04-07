const { authenticate } = require('@feathersjs/authentication').hooks;
const { serviceRescheduleSchema } = require('../../models/service-reschedule.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const parseDbConstraintError = require('../../hooks/parse-db-constraint-error');
const serializeRange = require('../../hooks/serialize-range');
const deserializeRange = require('../../hooks/deserialize-range');
const servicesEntityModifier  = require('../helpers/modifier-operators')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];
const intervalOpts = {
  intervalField: 'duration',
  serializedField: 'duration'
};
const timeRangeOpts = {
  lowerBoundField: 'visitStartTime',
  upperBoundField: 'visitEndTime',
  serializedField: 'timeWindow'
};

const dbErrorParseRules = [
  {
    constraint: 'nonEmptyTimeWindow',
    fieldName: 'windowStartTime',
    message: 'Time window cannot be empty'
  },
];

const validate = [...serviceRescheduleSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [...restrict],
    create: [...restrict, ...validate, attachTimeStamp, serializeRange(timeRangeOpts), servicesEntityModifier()],
    update: [...restrict, ...validate, serializeRange(timeRangeOpts), servicesEntityModifier()],
    patch: [...restrict, ...validate, serializeRange(timeRangeOpts), servicesEntityModifier()],
    remove: [...restrict]
  },
  after: {
    all: [deserializeRange(timeRangeOpts), deserializeRange(intervalOpts)],
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
