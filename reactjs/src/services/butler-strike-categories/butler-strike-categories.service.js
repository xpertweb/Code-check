// Initializes the `butlerStrikeCategories` service on path `/butlerStrikeCategories`
const createService = require('feathers-knex');
const hooks = require('./butler-strike-categories.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerStrikeCategories',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerStrikeCategories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerStrikeCategories');

  service.hooks(hooks);
};
