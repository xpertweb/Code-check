const { Schema } = require('feathers-schema');
const { ruuid, rdate, rdatetime } = require('./validators/regex');

export const allocationCancellation = new Schema({
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  comment: {
    type: String,
    length: { min: 0, max: 250 } 
  },
  lastModifiedBy: {
    type: String
  },
  dateTimeCreated: {
    format: [rdatetime]
  },
  dateOfVisitCancelled: {
    type: String,
    required: true,
    format: [rdate, 'Visit cancel date is invalid'] }
}); 
