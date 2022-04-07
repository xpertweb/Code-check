// A hook that logs service method before, after and error
const logger = require('winston');

module.exports = function () {
  return function (hook) {
    const loggingLayer = process.env.LOGGING_LAYER || 'console';

    if (hook.error){
      // any error just log it
      logger.error(hook.error.message);
    }

    if (process.env.NODE_ENV === 'test'){
      // Suppress non-error logs when running tests
      return;
    }


    if (loggingLayer === 'console' && process.env.NODE_ENV !== 'production'){
      logger.info(collectHookInfo(hook));
      logger.debug('hook.data', hook.data);
      logger.debug('hook.params', hook.params);
    }
  };
};


function collectHookInfo(hook){
  const message = `${hook.type}: ${hook.path} - Method: ${hook.method}`;
  if (hook.type === 'error') {
    return `${message}: ${hook.error.message}`;
  }

  return message;
}
