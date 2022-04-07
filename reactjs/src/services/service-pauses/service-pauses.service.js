// Initializes the `servicePauses` service on path `/servicePauses`
const createService = require('feathers-knex');
const hooks = require('./service-pauses.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'servicePauses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/servicePauses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('servicePauses');

  service.hooks(hooks);
};
