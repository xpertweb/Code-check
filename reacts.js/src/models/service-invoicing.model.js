const { Schema } = require('feathers-schema');
const { ruuid, rfrequency, rpaymentmethod } = require('./validators/regex');

export const serviceInvoicingSchema = new Schema({
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  recipientName: { type: String, length: { min: 1, max: 100 } },
  recipientEmail: { type: String,  email: true },
  recipientNumber: { type: String, },
  description: { type: String },
  frequency: {
    type: String,
    format: [rfrequency, 'Frequency must be \'w\', \'f\' or \'m\'']
  }, // (weekly, fortnightly, monthly)
  requiresTaxInvoice: { type: Boolean },
  paymentMethod: {
    type: String,
    format: [rpaymentmethod, 'Payment method must be \'directDebit\' or \'bankTransfer\'']
  },
  customAddress: { type: String},
  customState: { type: String},
  customPostcode: { type: Number }
});
