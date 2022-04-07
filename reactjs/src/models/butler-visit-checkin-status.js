
const { Schema } = require('feathers-schema');
const { ruuid,rdate,rdatetime} = require('./validators/regex');

export const butlerVisitCheckinStatus = new Schema({
  butlerId: { type: String, required: true, format: [ruuid, 'Butler id must be uuid'] },
  visitPlanId: { type: String, required: true, format: [ruuid, 'Visit Plan id must be uuid'] },
  comment: { type: String, length: { min: 0, max: 250 } },
  dateTimeCheckinCreated: { type: Date },
  butlerConfirmsCanAttendVisit: {type: Boolean},
  butlerConfirmsCannotAttendVisit: {type: Boolean},
  checkinCancelledAfterHavingBeenConfirmed: {type: Boolean},
  checkinConfirmedAfterHavingBeenCancelled: {type: Boolean},
  butlerScheduleWasModifiedAndNeedsToBeReconfirmed: {type: Boolean},
  visitDate:{ type: String, format: [rdate, 'Visit date is invalid'] },
  cancellationDateTime:{ type: String, format: [rdatetime, 'Cancellation date is invalid'] },
  butlerPreviouslyVisitedClient: {type: Boolean},
  butlerRescheduledWithClient: {type: Boolean},
  butlerRescheduledDate: {type: Date},
  butlerWillVisitClientInTheFuture: {type: Boolean},
  butlerNextAvailabilityDate: {type: Date},
  butlerAvailableThisWeek: {type: Boolean},
  butlerCancelledVisitBefore24hrs: {type: Boolean},
  butlerNextAvailabilityDateLocale: {type: [Object]},
  butlerRescheduledDateLocale: {type: Object},
  visitAssignedToButlerDateTime: { type: Date },
});
