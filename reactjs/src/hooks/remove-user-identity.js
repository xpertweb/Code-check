
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function removeUserIdentity (hook) {
    return hook.app.service('userIdentities').remove(hook.result.id).then(() => {
      return Promise.resolve(hook);
    });
  };
};
