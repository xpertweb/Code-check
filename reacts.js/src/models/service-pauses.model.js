const { ruuid, rdate } = require('./validators/regex');
const { Schema } = require('feathers-schema');

export const servicePauseSchema = new Schema({
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  startDate: { type: String, required: true, format: [rdate, 'Start date is invalid'] },
  endDate: { type: String, format: [rdate, 'End date is invalid'] },
  lastModifiedBy: {type: String },
  reason: {type:String ,length:{ min:0,max: 512 }}
});
