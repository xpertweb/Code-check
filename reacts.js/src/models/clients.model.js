const { Schema } = require('feathers-schema');
const { userSchemaProps } = require('./users.model');
const { rdecimal, ruuid, rcontact } = require('./validators/regex');

export const clientSchema = new Schema({
  ...userSchemaProps,
  legacyUsername: { type: String, length: { min: 0, max: 100 } },
  googleId: {
    type: String,
    format: [ruuid, 'Google id must be uuid']
  },
  facebookId: {
    type: String,
    format: [ruuid, 'Facebook id must be uuid']
  },
  voucherCode: { type: String, length: { min: 0, max: 100 } },
  voucherHours: { type: String, format: [rdecimal, 'Voucher hours must be decimal number'] },
  isConcierge: { type: Boolean },
  preferredContact: { type: String, format: [rcontact, 'Contact type must be \'m\' or \'e\''] }, // (mobile i.e. sms, email)
  leadSentToFacebookPixel: { type: Boolean },
  verified: { type: Boolean },//this field is set to true when a service was created for the user via Salesforce
  doNotSendRemindersTwoDaysBefore: { type: Boolean },
  //fields needed for email verification and password reset
  isVerified: { type: Boolean },
  verifyToken: { type: String },
  verifyExpires: { type: Date },
  verifyChanges: { type: Object },
  resetToken: { type: String },
  resetExpires: { type: Date },
  //end 
  dateTimeCreated: { type: Date},
  hasTwoButlers: { type: Boolean },
  doNotSendFeedbackRequestNotifications: { type: Boolean },
  doNotSendNotifications: { type: Boolean },
  priorityCommunications: { type: Boolean },
  salesForceLeadId: { type: String, length: { min: 0, max: 25 } },
  resetShortToken: { type: String }
});
