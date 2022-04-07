
const { Schema } = require('feathers-schema');
const { rcommitmentperiodenum } = require('./validators/regex');

export const allocationSettingsSchema = new Schema({
  daysFromNowToTakeOnlyRequestedVisits: { type: Number,  required: true },
  disqualifyingButlerRating: { type: Number,   required: true },
  disqualifyingNumberOfVisits: { type: Number,  required: true },
  maxAllocationsForButlerPerRun: { type: Number,   required: true },
  premiumRatingPointsForRequestedVisitButlers: { type: Number, required: true },
  premiumRatingPointsForFemaleButlers: { type: Number,  required: true },
  daysToAllocateFromToday: { type: Number,  required: true },
  commitmentPeriodThresholdSetting: {
    type: String,
    format: [rcommitmentperiodenum, 'Period must be one of cannotcommit|lessthanonemonth|morethanonemonth|morethanthreemonths|morethansixmonths|morethanoneyear']
  },
  minRequestsToAutoAllocateVisit: {type: Number, default: 0}
});
