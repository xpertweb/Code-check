// Initializes the `butlerStrikes` service on path `/butlerStrikes`
const createService = require('feathers-knex');
const hooks = require('./butler-strikes.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerStrikes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerStrikes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerStrikes');

  service.hooks(hooks);
};
