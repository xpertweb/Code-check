const createService = require('./email-logs.class');
const hooks = require('./email-logs.hooks');

module.exports = function () {
  const app = this;
  app.use('/emailLogs', createService({name: 'emailLogs'}));
  app.service('emailLogs').hooks(hooks);
};
