
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function createUserIdentity (hook) {
    return hook.app.service('userIdentities').create({}).then((userIdentity) => {
      hook.data.id = userIdentity.id;

      return Promise.resolve(hook);
    });
  };
};
