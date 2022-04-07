
const { Schema } = require('feathers-schema');
const { ruuid, rdatetime,rdate, rcommitmentperiodenum,rtime } = require('./validators/regex');

export const requestedVisitsSchema = new Schema({
  butlerId: { type: String, required: true, format: [ruuid, 'Butler id must be uuid'] },
  visitPlanId: { type: String, required: true, format: [ruuid, 'Visit Plan id must be uuid'] },
  comment: { type: String, length: { min: 0, max: 250 } },
  dateTimeRequestCreated: { type: String, required: true, format: [rdatetime, 'Date Time Request Created is invalid'] },
  dateTimeRequestProcessed: { type: String,  format: [rdatetime, 'Date Time Request Processed is invalid'] },
  preferredVisitTime: { type: String,  format: [rtime, 'Time Request preferred is invalid'] },
  preferredVisitDate: { type: String,  format: [rdate, 'Date Request preferred is invalid'] },
  alternativeVisitPlanDateAndTimeSelected: { type: Boolean },
  alternativeVisitTime: { type: String,  format: [rtime, 'Time Request preferred is invalid'] },
  alternativeStartDate: { type: String },
  alternativeEndDate: { type: String },
  visitPlanDate: { type: String, format: [rdate, 'Start date is invalid'] },
  processed: {type: Boolean },
  granted: {type: Boolean},
  periodWillingToCommit:{
    type: String,
    format: [rcommitmentperiodenum, 'Period must be one of cannotcommit|lessthanonemonth|morethanonemonth|morethanthreemonths|morethansixmonths|morethanoneyear']
  },
  payExpectedToBeReceivedFromVisit: { type: Number },
  dateWillingToCommitForThisVisit: { type: String, format: [rdate, 'Date willing to commit is invalid'] },
  dateOfVisitRequested: { type: String, format: [rdate, 'Date willing to commit is invalid'],required: false },
});
