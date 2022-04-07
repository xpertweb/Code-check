// Initializes the `serviceTasks` service on path `/service-tasks`
const createService = require('feathers-knex');
const hooks = require('./service-tasks.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceTasks',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceTasks', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceTasks');

  service.hooks(hooks);
};
