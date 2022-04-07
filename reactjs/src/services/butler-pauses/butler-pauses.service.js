// Initializes the `butlerPauses` service on path `/butlerPauses`
const createService = require('feathers-knex');
const hooks = require('./butler-pauses.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerPauses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerPauses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerPauses');

  service.hooks(hooks);
};
