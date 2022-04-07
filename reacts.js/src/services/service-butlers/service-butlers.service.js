// Initializes the `serviceButlers` service on path `/serviceButlers`
const createService = require('feathers-knex');
const hooks = require('./service-butlers.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceButlers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceButlers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceButlers');

  service.hooks(hooks);
};