// Initializes the `serviceExpenses` service on path `/serviceExpenses`
const createService = require('feathers-knex');
const hooks = require('./service-expenses.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceExpenses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceExpenses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceExpenses');

  service.hooks(hooks);
};
