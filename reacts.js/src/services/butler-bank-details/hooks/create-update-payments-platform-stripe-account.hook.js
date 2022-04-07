const axios = require('axios');
const logger = require('winston');
const {authenticateAgainstPaymentsPlatform} = require('../../../helpers/authenticate-against-payments-platform');
const errors = require('@feathersjs/errors');


async function updateOrCreateButlerStripeAccountWithBankDetails(token, butlerEmail, butlerCountry, bsb, bankAccountNumber,bankAccountName, addressLine1,
  state,
  locale,
  postcode,
  phoneNumber,
  dateOfBirth,
  requestorIp,
  butlerFirstName,
  butlerLastName
  ) {
  
  try {
    const response = await axios({
      method: 'post',
      url: process.env.PAYMENTS_URI,
      headers: { Authorization: 'Bearer ' + token },
      data: {
        query: //BSB its called routing number in most other countries out of australia
        `mutation { 
          updateOrCreateButlerStripeAccountWithBankDetails(
            bankAccountName : \"${bankAccountName}\"
            bankAccountNumber : \"${bankAccountNumber}\"
            butlerEmail : \"${butlerEmail}\"
            butlerCountry : \"${butlerCountry}\"
            bsb: \"${bsb}\"
            addressLine1 : \"${addressLine1}\"
            state: \"${state}\",
            city: \"${locale}\",
            postcode: \"${postcode}\"
            phoneNumber: \"${phoneNumber}\"
            dateOfBirth: \"${dateOfBirth}\"
            butlerFirstName: \"${butlerFirstName}\"
            butlerLastName: \"${butlerLastName}\"
            requestorIp: \"${requestorIp}\"
          ) {
            connectedStripeAccountId
            message
            status
            code
            connectedStripeAccountId
          }
        }`
      }
    });

    if (response.data.data.updateOrCreateButlerStripeAccountWithBankDetails && response.data.data.updateOrCreateButlerStripeAccountWithBankDetails.code == 400){
      // error creating hook 
      throw response.data.data.updateOrCreateButlerStripeAccountWithBankDetails.message;

    } else { // error creating hook 
      return response.data.data.updateOrCreateButlerStripeAccountWithBankDetails;
    }

  } catch (e) {
    logger.error('Error creating butler stripe payments account ' + e);
    throw new errors.BadRequest(e);
  }
}  

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function createUpdatePaymentsPlatformStripeAccount (hook) {
    try {
    let token;
    if (hook.params.headers.authorization){ // we create butler payment details if they provide a token
      token = hook.params.headers.authorization;
      const paymentsToken = await authenticateAgainstPaymentsPlatform(token.replace('Bearer ', ''));

      let butlerData;
      let butlerAddress;

      if (hook.params.user.roles.indexOf('butler') > -1){
        butlerData = hook.params.fullUserDetails;
        butlerAddress = hook.params.fullUserDetails.address;
      } else {
        butlerData = (await hook.app.service('butlers').find({
          query : {
            id: hook.data.butlerId
          }
        }))[0];
        butlerAddress = (await hook.app.service('butlerAddresses').find({ query: { butlerId: hook.data.butlerId } }))[0];
      }

      if (!butlerData.dateOfBirth || butlerData.dateOfBirth == ''){
        throw new errors.BadRequest('You must first provide a date of birth');
      }

      
      await updateOrCreateButlerStripeAccountWithBankDetails(paymentsToken, 
        butlerData.email, 
        butlerAddress.country, 
        hook.data.bankBsbNumber, 
        hook.data.bankAccountNumber, 
        hook.data.bankAccountName,
        butlerAddress.line1,
        butlerAddress.state,
        butlerAddress.locale,
        butlerAddress.postcode,
        butlerData.phoneNumber,
        butlerData.dateOfBirth,
        hook.params.requestor_ip,
        butlerData.firstName,
        butlerData.lastName
        );
    }
    

    return hook;
    }
    catch(ex){
      throw new errors.BadRequest(ex);
    }
  };
};
