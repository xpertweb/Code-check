// Initializes the `newChurnCategories` service on path `/new-churn-categories`
const createService = require('feathers-knex');
const hooks = require('./new-churn-categories.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'newChurnCategories',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/newChurnCategories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('newChurnCategories');

  service.hooks(hooks);
};
