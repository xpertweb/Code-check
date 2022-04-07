const { Schema } = require('feathers-schema');
const { ruuid } = require('./validators/regex');

export const serviceMarketingSchema = new Schema({
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  marketingChannel: { type: String },
  campaign: { type: String },
  salesperson: { type: String }
});
