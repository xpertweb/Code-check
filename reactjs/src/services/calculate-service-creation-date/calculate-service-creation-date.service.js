// Initializes the `visits` service on path `/visits`
const createService = require('./calculate-service-creation-date.class');
const hooks = require('./calculate-service-creation-date.hooks');

module.exports = (app) => {
  const paginate = app.get('paginate');
  const Model = app.get('knexClient');
  const options = {
    name: 'calculateServiceCreationDate',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/calculateServiceCreationDate', createService(options));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('calculateServiceCreationDate');
  service.hooks(hooks);
};
