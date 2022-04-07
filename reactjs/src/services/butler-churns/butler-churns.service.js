// Initializes the `butlerChurns` service on path `/butlerChurns`
const createService = require('feathers-knex');
const hooks = require('./butler-churns.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerChurns',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerChurns', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerChurns');

  service.hooks(hooks);
};
