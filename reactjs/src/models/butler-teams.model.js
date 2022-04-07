const { Schema } = require('feathers-schema');
const { ruuid, rdate } = require('./validators/regex');

export const butlerTeamsSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});
