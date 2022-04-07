
const {sendLeads} = require('../../../helpers/facebook-pixel');
const logger = require('winston');

module.exports = function (newlyCreatedUser) { // eslint-disable-line no-unused-vars
  return async function (hook) {

    try {
      if (hook.data && hook.data.verified && !hook.data.leadSentToFacebookPixel){
   
        let databaseClient;
        if (newlyCreatedUser){
          
          await sendLeads(hook.data.email);
        } else if (!newlyCreatedUser){
          databaseClient = (await hook.app.service('clients').find({
            query : {
              id: hook.data.id
            }
          }))[0];
          if (!databaseClient.verified && !databaseClient.leadSentToFacebookPixel){ // this means the client is now verified whereas it wasnt before
            //send lead to facebook
            await sendLeads(hook.data.email);
          }
        }
        hook.data.leadSentToFacebookPixel = true;
      }
    }
    catch(ex){
      logger.error('Failed to send leads to facebook')
      logger.error(ex.message);
    }
    
    return hook;
  };
};
