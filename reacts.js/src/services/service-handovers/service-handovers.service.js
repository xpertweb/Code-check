// Initializes the `serviceHandovers` service on path `/serviceHandovers`
const createService = require('feathers-knex');
const hooks = require('./service-handovers.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceHandovers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceHandovers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceHandovers');

  service.hooks(hooks);
};
