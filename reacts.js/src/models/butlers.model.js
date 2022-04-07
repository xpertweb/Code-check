const { Schema } = require('feathers-schema');
const { userSchemaProps } = require('./users.model');
const { rdate, rgender, rcontact, rexpectedtoliveinaustraliaperiod, rworkinghoursperweekideally,rhowlongwouldbutlerworkwithus,rpotentialreasonsbutlerwillleaveus, rreferencecheck, renglishcheck, ronboardedontoplatform } = require('./validators/regex');

export const butlerSchema = new Schema({
  ...userSchemaProps,
  gender: {
    type: String,
    required: true,
    format: [rgender, 'Gender must be \'m\' or \'f\'']
  },
  rating: { type: Number, required: true},
  managedSchedule: { type: Boolean },
  onFreeze: { type: Boolean, required: true },
  spraysWipesAndBasicsProvided: { type: Boolean},
  mopProvided: { type: Boolean},
  vacuumProvided: { type: Boolean},
  freezeReason: { type: String },
  churnsPerClientRating: { type: Number },
  handlesPets: { type: Boolean, required: true },
  hasCar: { type: Boolean, required: true },
  maxTravelDistance: {
    type: Number,
    required: true,
    range: { min: 0, max: 250000 }
  },
  languageProf: { type: Number, range: { min: 0, max: 2 } },
  cleaningExp: { type: Number, range: { min: 0, max: 5 } },
  preferredContact: { type: String, format: [rcontact, 'Contact type must be \'m\' or \'e\''] }, // (mobile i.e. sms, email)
  activeClients: { type: Number },
  dateTimeLastLogin: { type: Date},
  dateTimeCreated: { type: Date},
  dateOfBirth: { type:String, format: [rdate, 'Visit date is invalid'] },
  canDoOtherTaskThanPredefined: { type: String},
  cleaningExperienceAtAnotherHomeCleaningCompany: { type: Boolean },
  cleaningExperienceAtCommercialCleaningCompany: { type: Boolean },
  cleaningExperienceAtHotel: { type: Boolean },
  cleaningExperienceAtOneOrMorePrivateProperties: { type: Boolean },
  howWouldTheButlerTidyARoom: { type: String , length: { min: 0, max: 1000 }},
  tellUsAboutYourselfNotes: { type: String , length: { min: 0, max: 1000 }},
  policeCheckDocumentUrl: { type: String , length: { min: 0, max: 1000 }},
  curriculumUrl: { type: String , length: { min: 0, max: 1000 }},
  curriculumPlainText: { type: String , length: { min: 0, max: 1000 }},
  butlerRefereePhoneNumber: { type: String},
  passedIeltsExam: { type: Boolean }, 
  ieltsExamScore: { type: Number, range: {min:0, max: 9}},
  passedPteExam: { type: Boolean },
  nativeEnglishSpeaker: { type: Boolean },
  pteExamScore: { type: Number, range:{min:10, max:90} },
  hasWorkingRightsInAustralia : { type: Boolean },
  expectedLivingInAustraliaPeriod: { type: String, format: [rexpectedtoliveinaustraliaperiod, 'Expected period must be must be either of onetosixmonths|sixtotwelvemonths|twelvetotwentyfourmonths|longetthantwentyfourmonths'] },
  hasPoliceCheckOrWillGetOneWhenStartingWithUs: { type: Boolean },
  abnNumber: { type: String},
  canCommitToWorkSameDaysEachWeek: { type: Boolean },
  whereDidButlerHearAboutUs: { type: String},
  
    
  isStayAtHomeMum: { type: Boolean },
  isInternationalStudent: { type: Boolean },
  isHolidayWorker: { type: Boolean },
  isCareerCleanerOrHousekeeper: { type: Boolean },
  
  
  workingHoursPerWeekIdeally: { type: String, format: [rworkinghoursperweekideally, 'Expected period must be must be either of onetofourhoursperweek|fivetotenhoursperweek|eleventofifteenhoursperweek|sixteentotwentyhoursperweek|twentyonetothirtyhoursperweek|thirtyonetofourtyhoursperweek'] },
  howLongWouldButlerWorkWithUs: { type: String, format: [rhowlongwouldbutlerworkwithus, 'Expected period must be must be either of underonemonth|onetotwomonths|threetosixmonths|sixtoninemonths|ninetotwelvemonths|twelvetotwentyfourmonths|morethantwentyfourmonths|untilifindanotherjob|untilschoolstarts'] },
  reasonsButlerMayLeaveInComingMonths: { type: String, format: [rpotentialreasonsbutlerwillleaveus, 'Expected period must be must be either of nonesincebutlerwillworkforatleastsixmonths|yessincestudycommitmentswillincrease|yessincemightfindanotherjob|yessincebutlerwillbeleavethecountry|yessincebutlerwillhavefamilycommitments|yesbutlerwillhavetoleaveforanotherreason'] },
  previosulyWorkedOnCleaningPlatforms:{ type: String},
  answersGivenThruthfully: { type: Boolean },
  hasPublicLiabilityInsurance: { type: Boolean },
  verified: { type: Boolean },
  // fields needed for email verification and password reset
  isVerified: { type: Boolean },
  verifyToken: { type: String },
  verifyShortToken: { type: String },
  verifyExpires: { type: Date },
  verifyChanges: { type: Object },
  resetToken: { type: String },
  resetShortToken: { type: String },
  resetExpires: { type: Date },
  // end
  referenceCheck: { type: String, format: [rreferencecheck, 'Expected period must be either of successful|unsuccessful|incomplete'] },
  englishCheck: { type: String, format: [renglishcheck, 'Expected period must be either of advanced|intermediate|beginner|incomplete'] }, 
  onboardedOntoPlatform: { type: String, format: [ronboardedontoplatform, 'Expected period must be either of yes|incomplete'] },

  vacuumSuppliedByJarvis: { type: Boolean },
  vacuumReturnedToJarvis: { type: Boolean },
  disinfectantProvided: {type: Boolean},
  steamCleanerProvided: {type: Boolean},
  carpetDryCleaningProvided: {type: Boolean},
  endOfLeaseProvided: {type: Boolean},
  furnitureAssemblyProvided: {type: Boolean},
  packingServiceProvided: {type: Boolean},
  jarvisProvidedSteamCleaner: {type: Boolean},
  doNotSendAllocationsNotifications: {type: Boolean},
  doNotSendNotifications: {type: Boolean},
  gardeningServiceProvided: {type: Boolean},
  neverCall: {type: Boolean},
  doNotCallToday: {type: Date}
});


      