// Initializes the `serviceChurns` service on path `/service-churns`
const createService = require('feathers-knex');
const hooks = require('./service-churns.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceChurns',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceChurns', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceChurns');

  service.hooks(hooks);
};
