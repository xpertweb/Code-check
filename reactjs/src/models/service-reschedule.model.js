const { Schema } = require('feathers-schema');
const { 
  ruuid, 
  rtime,
  rdate,
  rreschedulestatus } = require('./validators/regex');

export const serviceRescheduleSchema = new Schema({
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  visitDate: {
    type: String,
    required: true,
    format: [rdate, 'Visit date is not valid']
  },
  rescheduleStatus: {
    type: String,
    required: true,
    format: [rreschedulestatus, 'Reschedule status must be one of successfullyrescheduled|churned|notcontacted'] },
  visitStartTime: {
    type: String,
    required: true,
    format: [rtime, 'Window start time is invalid']
  },
  visitEndTime: {
    type: String,
    required: true,
    format: [rtime, 'Window end time is invalid']
  },
  state: {
    type: String,
    required: true
  },
  mopRequired: { type: Boolean },
  vacuumRequired: { type: Boolean }
});
