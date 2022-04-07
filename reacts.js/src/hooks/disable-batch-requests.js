const { BadRequest } = require('@feathersjs/errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function disableBatchRequests (hook) {
    if (Array.isArray(hook.data)) {
      return Promise.reject(new BadRequest('Batch requests are not allowed. (disableBatchRequests)'));
    }

    return Promise.resolve(hook);
  };
};
