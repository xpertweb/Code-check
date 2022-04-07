
const { Schema } = require('feathers-schema');
const { addressSchemaProps } = require('./addresses.model');
const { ruuid, rdate } = require('./validators/regex');

export const butlerAddressSchema = new Schema({
  ...addressSchemaProps,
  butlerId: { type: String, required: true, format: [ruuid, 'Butler id must be uuid'] },
  activeFrom: { type: String, required: true, format: [rdate, 'Active-from date is invalid'] },
});
