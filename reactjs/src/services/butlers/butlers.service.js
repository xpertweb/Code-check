// Initializes the `butlers` service on path `/butlers`
const createService = require('feathers-knex');
const hooks = require('./butlers.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlers');

  service.hooks(hooks);
};
