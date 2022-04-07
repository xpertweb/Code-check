const { Schema } = require('feathers-schema');
const { ruuid, rdate } = require('./validators/regex');

export const serviceChurnsSchema = new Schema({
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  creationDate: {
    type: String,
    required: true,
    format: [rdate, 'Creation Date is invalid']
  },
  reasonId: { // deprecated, we use primaryReasonId now
    type: String,
    format: [ruuid, 'Reason id must be uuid']
  },
  primaryReasonId: {
    type: String,
    required: true,
    format: [ruuid, 'Primary reason id must be uuid']
  },
  secondaryReasonId: {
    type: String,
    format: [ruuid, 'Secondary reason id must be uuid']
  },
  comment: {
    type: String,
    length: { min: 0, max: 1000 }
  },
  getBackInTouchDate: {
    type: String,
    format: [rdate, 'Get back in touch Date is invalid']
  }
});
