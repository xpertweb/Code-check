const {
  ruuid,
  rdate,
  rtime,
  rrecurrence,
  rdecimal
} = require('./validators/regex');
const { Schema } = require('feathers-schema');

export const butlerAndButlerTeamSchema = new Schema({
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  },
  butlerTeamId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler Team id must be uuid']
  }
});
