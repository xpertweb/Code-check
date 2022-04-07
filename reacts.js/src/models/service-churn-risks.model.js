const { Schema } = require('feathers-schema');
const { ruuid, rdate } = require('./validators/regex');

export const serviceChurnRiskSchema = new Schema({
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
  riskRating: {
    type: Number,
    required: true,
    range: { min: 0, max: 100 }
  },
  note: {
    type: String
  }
});
