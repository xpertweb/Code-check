module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function createUserIdentity (hook) {
    hook.data.dateTimeCreated = (new Date().toISOString()).slice(0, 19).replace('T', ' ');
    return Promise.resolve(hook);
  };
};
