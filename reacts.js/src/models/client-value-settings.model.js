const { Schema } = require('feathers-schema');

export const clientValueSettingsSchema = new Schema({
  futureWeeklyVisitPlansMultiplier: { type: Number,  required: true },
  futureFortnightlyVisitPlansMultiplier: { type: Number,  required: true },
  futureOnceOffVisitPlansMultiplier: { type: Number,  required: true },
  daysOfClientLoyaltyMultiplier: { type: Number,  required: true },
  churnRiskMultiplier: { type: Number,  required: true },
  spraysWipesAndBasicsAddedPoints: { type: Number,  required: true },
  vacuumAndMopAddedPoints: { type: Number,  required: true },
  thirdPartyJobReducedPoints: { type: Number,  required: true },
  whizzServicesPoints: { type: Number,  required: true }

});