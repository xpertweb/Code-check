const { Schema } = require('feathers-schema');
const { ruuid } = require('./validators/regex');

export const serviceTaskSchema = new Schema({
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  taskId: {
    type: String,
    required: true,
    format: [ruuid, 'Task id must be uuid']
  }
});
