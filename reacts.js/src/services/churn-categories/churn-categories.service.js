// Initializes the `churnCategories` service on path `/churnCategories`
const createService = require('feathers-knex');
const hooks = require('./churn-categories.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'churnCategories',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/churnCategories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('churnCategories');

  service.hooks(hooks);
};
