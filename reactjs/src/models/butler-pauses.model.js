const { ruuid, rdate } = require('./validators/regex');
const { Schema } = require('feathers-schema');

export const butlerPauseSchema = new Schema({
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  },
  startDate: {
    type: String,
    required: true,
    format: [rdate, 'Start date is invalid']
  },
  endDate: { type: String, format: [rdate, 'End date is invalid'] },
  reason: { type: String }
});
