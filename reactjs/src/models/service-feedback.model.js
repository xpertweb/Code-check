const { Schema } = require('feathers-schema');
const { feedbackSchemaProps } = require('./feedback.model');
const { ruuid, rdate, rfeedbackappealedstatus } = require('./validators/regex');

export const serviceFeedbackSchema = new Schema({
  ...feedbackSchemaProps,
  serviceId: {
    type: String,
    required: true,
    format: [ruuid, 'Service id must be uuid']
  },
  comment: {
    type: String,
    length: { min: 0, max: 250 }
  },
  creationDate: { type: String, required: true, format: [rdate, 'Creation date is invalid'] },
  doNotShareFeedbackWithButler: {type: Boolean},
  butlerWasLate: { type: Boolean },
  butlerLeftEarly: { type: Boolean },
  butlerDidNotShowUp: { type: Boolean },
  feedbackAppealedStatus: {type: String, format: [rfeedbackappealedstatus, 'Feedback appealed must be one of none|appealed|appealedresolved|noappeal'] }
});
