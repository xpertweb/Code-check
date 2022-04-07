module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function createUserIdentity(hook) {

    if (!hook.data.preferredContact){
      hook.data.preferredContact = 'm';
    }

    return Promise.resolve(hook);
  };
};
