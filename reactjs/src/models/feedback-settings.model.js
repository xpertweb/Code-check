const { Schema } = require('feathers-schema');

export const feedbackSettingsSchema = new Schema({
  premiumThresholdRating: { type: Number,  required: true },
  penaltyThresholdRating: { type: Number,  required: true },
  premiumRating: { type: Number,  required: true },
  negativeRating: { type: Number,  required: true },
  butlerDefaultRatingToSet: { type: Number,  required: true },
  penalizeRepeatedBadRatingCoefficient: { type: Number,  required: true },
  penalizeRepeatedBadRatingThreshold: { type: Number,  required: true },
});
