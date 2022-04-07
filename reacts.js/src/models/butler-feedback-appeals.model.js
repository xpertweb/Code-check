const { ruuid, rdate } = require('./validators/regex');
const { Schema } = require('feathers-schema');



const statusRule = /^(new|approved|denied)$/;

export const butlerFeedbackAppealsSchema = new Schema({
  butlerId: { type: String, required: true, format: [ruuid, 'butler id is invalid'] },
  status: { type: String, default: 'new', format: [statusRule, 'status value is invalid'] },
  description: { type: String },
  dateStatusChanged: { type: String, format: [rdate, 'dateStatusChanged is invalid'] },
  dateOfCreation: { type: String, format: [rdate, 'dateOfCreation is invalid']},
  reason: { type: String, default: '' },
  feedbackId: { type: String, required: true, format: [ruuid, 'feedback id is invalid'] },
  butlerReason: { type: String, default: '' }
});