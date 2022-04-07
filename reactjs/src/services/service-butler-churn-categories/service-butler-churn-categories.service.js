// Initializes the `serviceButlerChurnCategories` service on path `/serviceButlerChurnCategories`
const createService = require('feathers-knex');
const hooks = require('./service-butler-churn-categories.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceButlerChurnCategories',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceButlerChurnCategories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceButlerChurnCategories');

  service.hooks(hooks);
};
