const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const { workBlockSchema } = require('../../models/work-blocks.model');
const serializeRange = require('../../hooks/serialize-range');
const deserializeRange = require('../../hooks/deserialize-range');
const parseDbConstraintError = require('../../hooks/parse-db-constraint-error');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'butlerId'
  })
];

const validate = [ ...workBlockSchema.hooks ];

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
    constraint: 'nonOverlappingDateRangesOnSameDay',
    message: 'Date ranges cannot overlap for an entry on the same day'
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
    create: [
      ...validate,
      attachTimeStamp,
      serializeRange(dateRangeOpts),
      serializeRange(timeRangeOpts)
    ],
    update: [
      ...validate,
      serializeRange(dateRangeOpts),
      serializeRange(timeRangeOpts)
    ],
    patch: [
      ...validate,
      serializeRange(dateRangeOpts),
      serializeRange(timeRangeOpts)
    ],
    remove: []
  },

  after: {
    all: [
      deserializeRange(dateRangeOpts),
      deserializeRange(timeRangeOpts)
    ],
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
