
module.exports =  function (options = {}) { // eslint-disable-line no-unused-vars
  return async function handleCreateUserErrorAndVerifyIfPreExistingUser (hook) {
    let fixedError = false;

    //the code below will try to merge existing accounts together
    let foundUser;
    if (hook.data.email) {
      foundUser = (await hook.app.service('clients').find({
        query : {
          email: hook.data.email 
        }
      }))[0];
      if (foundUser){
        console.log(hook.data.facebookId, foundUser.facebookId);
        if (hook.data.facebookId && !foundUser.facebookId ){
          let facebookClient = (await hook.app.service('facebookClients').find({
            query : {
              id : hook.data.facebookId,
              email: foundUser.email
            }
          }))[0];     
          if (facebookClient){
            await hook.app.service('clients').patch(foundUser.id,{facebookId: facebookClient.id, isVerified:true});
            fixedError = true;
          }
        }
        if (hook.data.googleId && !foundUser.googleId ){
          let googleClient = (await hook.app.service('googleClients').find({
            query : {
              id : hook.data.googleId,
              email: foundUser.email
            }
          }))[0];
          if (googleClient){
            await hook.app.service('clients').patch(foundUser.id,{googleId: googleClient.id, isVerified:true});
            fixedError = true;
          }   
        }
      }
    }

    if (fixedError){
      hook.error.code = 200;
      hook.error.errors = null;
      hook.error.message = null;
    }

    return Promise.resolve(hook);
  };
};
