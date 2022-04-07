const { authenticate } = require('@feathersjs/authentication').hooks;
const { visitPlanSchema } = require('../../models/visit-plans.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const serializeRange = require('../../hooks/serialize-range');
const deserializeRange = require('../../hooks/deserialize-range');
const parseDbConstraintError = require('../../hooks/parse-db-constraint-error');
const deserializeInterval = require('../../hooks/deserialize-interval');
const allowOperatorAllOrButlerSelf = require('../../permissions/allow-operator-all-or-butler-self'); 
const checkPermissions = require('feathers-permissions');
const calculateLastVisitCreationDateForService = require('./hooks/calculate-last-visit-creation-date-for-service.hook');
const calculateButlerSchedulesAffectedByVisitPlanChange = require('./hooks/calculate-butler-schedules-affected-by-visit-plan-change.hook');
const changeHourlyRateOverrideValue = require('./hooks/set-hourlyRateOverride-value.hook');
const servicesEntityModifier  = require('../helpers/modifier-operators')


const restrict = [
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [ ...visitPlanSchema.hooks ];

const dateRangeOpts = {
  lowerBoundField: 'startDate',
  upperBoundField: 'endDate',
  serializedField: 'dateRange'
};

const timeRangeOpts = {
  lowerBoundField: 'windowStartTime',
  upperBoundField: 'windowEndTime',
  serializedField: 'timeWindow'
};

const intervalOpts = {
  intervalField: 'duration',
  serializedField: 'duration'
};

const dbErrorParseRules = [
  {
    constraint: 'nonEmptyTimeWindow',
    fieldName: 'windowStartTime',
    message: 'Time window cannot be empty'
  },
  {
    constraint: 'nonEmptyDateRange',
    fieldName: 'startDate',
    message: 'Date range cannot be empty'
  },
  {
    constraint: 'nonZeroDuration',
    fieldName: 'duration',
    message: 'Duration cannot be zero'
  },
  {
    constraint: 'timeWindowLargeEnough',
    message: 'Duration must be short enough to fit inside given time window'
  }
];
function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [...allowOperatorAllOrButlerSelf('butlerId')],
    get: [...restrict],
    create: [
      checkPermissions({
        roles: ['operator'],
        field: 'roles' 
      }),
      ...validate,
      attachTimeStamp,
      serializeRange(dateRangeOpts),
      serializeRange(timeRangeOpts),
      servicesEntityModifier(),
      changeHourlyRateOverrideValue()
    ],
    update: [
      ...restrict,
      ...validate,
      serializeRange(dateRangeOpts),
      serializeRange(timeRangeOpts),
      servicesEntityModifier(),
      changeHourlyRateOverrideValue()
    ],
    patch: [
      ...restrict,
      ...validate,
      serializeRange(dateRangeOpts),
      serializeRange(timeRangeOpts),
      servicesEntityModifier(),
      changeHourlyRateOverrideValue()
    ],
    remove: [...restrict]
  },

  after: {
    all: [
      deserializeRange(dateRangeOpts),
      deserializeRange(timeRangeOpts),
      deserializeInterval(intervalOpts)
    ],
    find: [],
    get: [],
    create: [calculateLastVisitCreationDateForService()],
    update: [
      calculateLastVisitCreationDateForService(),
      calculateButlerSchedulesAffectedByVisitPlanChange(),
    ],
    patch: [
      calculateLastVisitCreationDateForService(), 
      calculateButlerSchedulesAffectedByVisitPlanChange()],
    remove: [
      calculateLastVisitCreationDateForService()] //deleting a visit plan deletes all requested visits and check ins
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
