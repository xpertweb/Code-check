const { ruuid, rdatetime } = require('./validators/regex');
const { Schema } = require('feathers-schema');

const statusRule = /^(new|approved|denied)$/;

export const butlerDisputesSchema = new Schema({
  approvalStatus: { type: String, format: [statusRule, 'status value is invalid'] },
  historicVisitId: { type: String, required: true},
  visitWasNotRecorded: { type: Boolean, default: false},
  disputeReason: { type: String, required: true },
  disputeQuesAns: { type: String, required: true},
  clientEmail: { type: String},
  butlerEmail: { type: String, required: true},
  snapShotFile: { type: String, required: true},
});
