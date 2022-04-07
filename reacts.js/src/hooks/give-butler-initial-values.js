module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function createUserIdentity(hook) {
    if (!hook.data.spraysWipesAndBasicsProvided){
      hook.data.spraysWipesAndBasicsProvided = false;
    }
    if (!hook.data.vacuumProvided){
      hook.data.vacuumProvided = false;
    }
    if (!hook.data.mopProvided){
      hook.data.mopProvided = false;
    }

    hook.data.verified = false;
    hook.data.onFreeze = true;

    if (!hook.data.preferredContact){
      hook.data.preferredContact = 'm';
    }

    return Promise.resolve(hook);
  };
};
