
const { Schema } = require('feathers-schema');
const { ruuid } = require('./validators/regex');

export const serviceCallHistorySchema = new Schema({
  serviceId: { type: String, required: true, format: [ruuid, 'Service id must be uuid'] },
  unchurnAttemptComment: { type: String},
  firstVisitFollowUpCallComment: { type: String},
  debtorCallComment: { type: String},
  unchurnAttempt: {type: Boolean },
  firstVisitFollowUpCall: {type: Boolean},
  debtorCall: {type: Boolean},
}); 
