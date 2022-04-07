const { Schema } = require('feathers-schema');
const { ruuid, rdate } = require('./validators/regex');

export const serviceHandoverSchema = new Schema({
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
  note: {
    type: String
  }
});
