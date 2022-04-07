
const { Schema } = require('feathers-schema');
const { ruuid, rdate, rdecimal } = require('./validators/regex');

export const serviceExpenseSchema = new Schema({
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  date: { type: String, required: true, format: [rdate, 'Date is invalid'] },
  amount: { type: String, required: true, format: [rdecimal, 'Amount must be decimal number'] },
  summary: { type: String, required: true, length: { min: 0, max: 250 } }
});
