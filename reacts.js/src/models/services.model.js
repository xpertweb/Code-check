const { Schema } = require('feathers-schema');
const { ruuid, rgendern, rdatetime,rdate } = require('./validators/regex');

const AllowedServiceLine = /^(cleaning|furniture_assembly|packing_service|gardening)$/;

export const serviceSchema = new Schema({
  clientId: {
    type: String,
    required: true,
    format: [ruuid, 'Client id must be uuid']
  },
  lastVisitDate:{ type: String, format: [rdate, 'Last visit date is invalid'] },
  lastVisitCreationDate: { type: Date},
  pets: { type: Boolean, required: true },
  genderPref: {
    type: String,
    required: true,
    format: [rgendern, 'Gender preference must be \'m\', \'f\' or \'n\'']
  },
  active: { type: Boolean },
  serviceAllocated: { type: Boolean },
  errands: { type: Boolean, required: true },
  spraysWipesAndBasicsRequired: { type: Boolean},
  vacuumRequired: { type: Boolean},
  mopRequired: { type: Boolean},
  notes: {
    type: String,
    length: { min: 0, max: 10000 }
  },
  visitGuaranteed: { type: Boolean, required: true },
  clientRating: { type: Number, range: { min: 0, max: 5 }, required: true },
  clientLifetimeValue: { type: Number, required: true },
  languageProf: { type: Number, range: { min: 0, max: 2 } },
  isOneOff: { type: Boolean },
  cancelFeeHasBeenWaived: { type: Boolean },
  defaultedVisit: { type: Boolean },
  isThirdPartyJob: { type: Boolean },
  couponCode: {
    type: String,
    length: { min: 0, max: 250 }
  },
  isWhizzClient: { type: Boolean },
  disinfectantRequired: {type: Boolean},
  steamCleanerRequired: {type: Boolean},
  carpetDryCleaningRequired: {type: Boolean},
  endOfLeaseRequired: {type: Boolean},
  furnitureAssemblyRequired: {type: Boolean},
  serviceLine: {
    type: String,
    format: [AllowedServiceLine, 'Service Line value is invalid, it must be cleaning or furniture assembly']
  },
  numberOfBeds: { type: Number  },
  numberOfBathrooms: { type: Number},
  packingServiceRequired: {type: Boolean},
  urgentExtraPayAmount: {type: Number},
  urgentExtraPayProvided: {type: Boolean},
  gardeningServiceRequired: {type: Boolean}
});
