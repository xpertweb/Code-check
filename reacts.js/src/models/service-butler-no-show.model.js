const { Schema } = require('feathers-schema');
const { ruuid, rdate, rbutlernoshowreason } = require('./validators/regex');

export const serviceButlerNoShowSchema = new Schema({

  date: { type: String, required: true, format: [rdate, 'Creation date is invalid'] },
  reason: { type: String, required: true, format: [rbutlernoshowreason, 'Invalid reason'] },
  otherReason: { 
    type: String,
    length: { min: 0, max: 250 } 
  },
  operatorName: { 
    type: String,
    length: { min: 0, max: 255 } 
  },
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  }
});
