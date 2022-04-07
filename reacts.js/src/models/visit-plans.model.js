const {
  ruuid,
  rdate,
  rtime,
  rrecurrence,
  rdecimal
} = require('./validators/regex');
const { Schema } = require('feathers-schema');

export const visitPlanSchema = new Schema({
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  startDate: {
    type: String,
    required: true,
    format: [rdate, 'Start date is invalid']
  },
  endDate: { type: String, format: [rdate, 'End date is invalid'] },
  windowStartTime: {
    type: String,
    required: true,
    format: [rtime, 'Window start time is invalid']
  },
  windowEndTime: {
    type: String,
    required: true,
    format: [rtime, 'Window end time is invalid']
  },
  duration: {
    type: String,
    required: true,
    format: [rtime, 'Duration is invalid']
  },
  recurrence: {
    type: String,
    required: true,
    format: [rrecurrence, 'Recurrence must be \'n\', \'w\' or \'f\'']
  }, // (none, weekly, fortnightly)
  hourlyRateOverride: {
    type: String,
    format: [rdecimal, 'Rate must be decimal number']
  },
  comment: { type: String, length: { min: 0, max: 250 } },
  alternativeStartDate: {type: String, format: [rdate, 'Alternative Start date is invalid']},
  alternativeEndDate: { type: String, format: [rdate, 'Alternative End date is invalid'] },
  alternativeWindowStartTime: {type: String, format: [rtime, 'Alternative Window start time is invalid']},
  alternativeWindowEndTime: { type: String, format: [rtime, 'Alternative Window end time is invalid'] },
  lastModifiedBy: { type: String },
  numberOfRequests: { type: Number },
});
