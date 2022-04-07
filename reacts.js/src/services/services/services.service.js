// Initializes the `services` service on path `/services`
const createService = require('feathers-knex');
const hooks = require('./services.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'services',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/services', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('services');

  service.hooks(hooks);
};
