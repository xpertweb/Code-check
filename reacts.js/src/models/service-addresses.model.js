const { Schema } = require('feathers-schema');
const { addressSchemaProps } = require('./addresses.model');
const { ruuid, rdate } = require('./validators/regex');

export const serviceAddressSchema = new Schema({
  ...addressSchemaProps,
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  activeFrom: { type: String, required: true, format: [rdate, 'Active-from date is invalid'] },
});


export const serviceAddressSchemaOnCreate = new Schema({
  ...addressSchemaProps,
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  activeFrom: { type: String, required: true, format: [rdate, 'Active-from date is invalid'] },
  needsToBeAllocated: { type:Boolean },
  needsToBeAllocatedByEmail: { type:Boolean }
});
