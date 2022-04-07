// Initializes the `serviceLogs` service on path `/service-logs`
const { ServiceLogs } = require('./service-logs.class');
const hooks = require('./service-logs.hooks');

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/serviceLogs', new ServiceLogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('serviceLogs');

  service.hooks(hooks);
};
