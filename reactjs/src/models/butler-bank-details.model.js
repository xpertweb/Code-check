const { Schema } = require('feathers-schema');
const { ruuid, rbsbexactlength } = require('./validators/regex');

export const butlerBankDetailsModel = new Schema({
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  },
  bankAccountName: {
    type: String,
    required: true
  },
  bankBsbNumber: {
    type: String,
    required:true,
    format: [rbsbexactlength, 'Length of BSB has to be 6 digits']
  },
  bankAccountNumber: {
    type: String,
    required: true
  },
});
