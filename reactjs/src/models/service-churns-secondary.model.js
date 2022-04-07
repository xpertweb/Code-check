const { Schema } = require('feathers-schema');
const { ruuid, rdate } = require('./validators/regex');

export const serviceChurnsSecondarySchema = new Schema({
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
  reasonId: {
    type: String,
    required: true,
    format: [ruuid, 'Reason id must be uuid']
  },
  comment: {
    type: String,
    length: { min: 0, max: 1000 }
  },
  getBackInTouchDate: {
    type: String,
    format: [rdate, 'Get back in touch Date is invalid']
  },
  butlerId: {
    type: String,
    format: [ruuid, 'Butler id must be uuid']
  }
});
