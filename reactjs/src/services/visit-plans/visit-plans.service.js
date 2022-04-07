// Initializes the `visitPlans` service on path `/visitPlans`
const createService = require('feathers-knex');
const hooks = require('./visit-plans.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'visitPlans',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/visitPlans', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('visitPlans');

  service.hooks(hooks);
};
