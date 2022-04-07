// Initializes the `visits` service on path `/visits`
const createService = require('./visits-with-furthest-recurrence.class');
const hooks = require('./visits-with-furthest-recurrence.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'visitsWithFurthestRecurrence',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/visitsWithFurthestRecurrence', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('visitsWithFurthestRecurrence');

  service.hooks(hooks);
};
