// Initializes the `butlerChurnCategories` service on path `/butlerChurnCategories`
const createService = require('feathers-knex');
const hooks = require('./butler-churn-categories.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerChurnCategories',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerChurnCategories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerChurnCategories');

  service.hooks(hooks);
};
