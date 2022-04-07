const { Schema } = require('feathers-schema');
const { ruuid, rdate } = require('./validators/regex');

export const butlerStrikesSchema = new Schema({
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  },
  strikeDate: {
    type: String,
    required: true,
    format: [rdate, 'Churn Date is invalid']
  },
  reasonId: {
    type: String,
    required: true,
    format: [ruuid, 'Reason id must be uuid']
  }
});
