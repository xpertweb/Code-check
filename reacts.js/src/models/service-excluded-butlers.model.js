
const { Schema } = require('feathers-schema');
const { ruuid } = require('./validators/regex');

export const serviceExcludedButlerSchema = new Schema({
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  butlerId: { type: String, required: true, format: [ruuid, 'Butler id must be uuid'] },
  reason: { type: String, length: { min: 0, max: 250 } },
  lastModifiedBy:{ type: String }
});
