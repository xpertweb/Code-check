const { Schema } = require('feathers-schema');

export const churnPerClientSettings = new Schema({
  daysOfTenureByButler: { type: Number },
  disqualifyingChurnPerClientRating: { type: Number },
  maximumVisitPlanPriceToCountTowardsCpc: { type: Number}
});
