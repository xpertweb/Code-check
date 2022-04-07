// Initializes the `butlerAddresses` service on path `/butlerAddresses`
const createService = require('feathers-knex');
const hooks = require('./butler-addresses.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerAddresses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerAddresses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerAddresses');

  service.hooks(hooks);
};
