
var errors = require('feathers-errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function customIsVerifiedHook(hook) {
    if (hook.params.user) {
      let clientToVerify = null;

      const result = (await hook.app.service('clients').find({
        query: {
          id: hook.params.user.id
        }
      }))[0];
      if (result) {
        clientToVerify = result;
      }

      if (clientToVerify) { // only check verification for clients 
        if (clientToVerify.isVerified) {
          return Promise.resolve(hook);
        } else {
          throw new errors.BadRequest('User\'s email is not yet verified.');
        }
      } else {
        return Promise.resolve(hook);
      }
    } else {
      return Promise.resolve(hook);
    }

  };
};
