// Initializes the `tasks` service on path `/tasks`
const createService = require('feathers-knex');
const hooks = require('./tasks.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'tasks',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/tasks', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('tasks');

  service.hooks(hooks);
};
