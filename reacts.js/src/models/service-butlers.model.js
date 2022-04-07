
const { Schema } = require('feathers-schema');
const { ruuid, rdate, rdecimal,rbutlerAllocatedByMethod } = require('./validators/regex');

export const serviceButlerSchema = new Schema({
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  butlerId: { type: String, required: true, format: [ruuid, 'Butler id must be uuid'] },
  hourlyPayOverride: { type: String, format: [rdecimal, 'Pay must be decimal number'] },
  comment: { type: String, length: { min: 0, max: 250 } },
  activeFrom: { type: String, required: true, format: [rdate, 'Active-from date is invalid'] },
  churnReasonId: {
    type: String,
    format: [ruuid, 'Reason id must be uuid']
  },
  butlerAllocatedByMethod: {
    type: String,
    format: [rbutlerAllocatedByMethod, 'Butler Allocated Method must be Manual, ManagedScheduleSystem , ButlerRequestedThisVisit or trs']
  },
  lastModifiedBy:{
    type: String
  }
});


export const serviceButlerSchemaOnCreate = new Schema({
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  butlerId: { type: String, required: true, format: [ruuid, 'Butler id must be uuid'] },
  hourlyPayOverride: { type: String, format: [rdecimal, 'Pay must be decimal number'] },
  comment: { type: String, length: { min: 0, max: 250 } },
  activeFrom: { type: String, required: true, format: [rdate, 'Active-from date is invalid'] },
  churnReasonId: {
    type: String,
    format: [ruuid, 'Reason id must be uuid']
  },
  butlerAllocatedByMethod: {
    type: String,
    format: [rbutlerAllocatedByMethod, 'Butler Allocated Method must be Manual, ManagedScheduleSystem , ButlerRequestedThisVisit or trs']
  },
  needsToBeAllocated: { type:Boolean },
  needsToBeAllocatedByEmail: { type:Boolean },
  lastModifiedBy:{
    type: String
  }
});
