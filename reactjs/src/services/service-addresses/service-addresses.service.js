// Initializes the `serviceAddresses` service on path `/serviceAddresses`
const createService = require('feathers-knex');
const hooks = require('./service-addresses.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceAddresses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceAddresses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceAddresses');

  service.hooks(hooks);
};
