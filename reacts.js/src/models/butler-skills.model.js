const { Schema } = require('feathers-schema');
const { ruuid } = require('./validators/regex');

export const butlerSkillsSchema = new Schema({
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  },
  taskId: {
    type: String,
    required: true,
    format: [ruuid, 'Task id must be uuid']
  }
});
