module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function creationDateHook (hook) {
    hook.data.dateTimeCheckinCreated = (new Date().toISOString()).slice(0, 19).replace('T', ' ');
    return Promise.resolve(hook);
  };
};
