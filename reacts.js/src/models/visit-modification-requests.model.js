const {
  ruuid,
  rdate,
  rtime
} = require('./validators/regex');
const { Schema } = require('feathers-schema');
const statusRule = /^(pending|approved|denied|cancelled)$/;

export const visitModificationRequestsSchema = new Schema({
  clientId: {
    type: String,
    required: true,
    format: [ruuid, 'Client id must be uuid']
  },
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  visitPlanId: {
    type: String,
    required: true,
    format: [ruuid, 'Visit plan id must be uuid']
  },
  visitDate: {
    type: String,
    required: true,
    format: [rdate, 'Visit date is invalid']
  },
  preferredDate: {
    type: String,
    format: [rdate, 'Preferred date is invalid']
  },
  preferredDateSecondary: {
    type: String,
    format: [rdate, 'Secondary preferred date is invalid']
  },
  preferredTime: {
    type: String,
    format: [rtime, 'Preferred time is invalid']
  },
  preferredTimeSecondary: {
    type: String,
    format: [rtime, 'Secondary preferred time is invalid']
  },
  visitDuration: {
    type: String,
    format: [rtime, 'Duration is invalid']
  },
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  },
  butlerChangeReason: {
    type: String,
    length: { min: 0, max: 500 }
  },
  modifyAllFutureVisits: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    format: [statusRule, 'status value is invalid']
  },
  dateTimeCreated: { type: Date },
  newButlerNeeded: {
    type: Boolean,
    required: true
  },
});
