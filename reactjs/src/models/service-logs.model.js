const { ruuid, rdate } = require('./validators/regex');
const { Schema } = require('feathers-schema');

export const ServiceLogsSchema = new Schema({
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  logText: {type: String,required:true },
  logJson: {type: String },
  createdBy: {type: String },
});
