
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function normalizeFacebookSignup (hook) {
    if (hook.params.oauth && hook.params.oauth.provider === 'facebook') {
      hook.data.email = hook.data.facebook.profile._json.email;
      hook.data.firstName = hook.data.facebook.profile._json.first_name;
      hook.data.lastName = hook.data.facebook.profile._json.last_name;
      delete hook.data.facebook;
    }

    return Promise.resolve(hook);
  };
};
