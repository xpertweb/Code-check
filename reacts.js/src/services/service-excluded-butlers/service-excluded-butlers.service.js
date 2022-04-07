// Initializes the `serviceExcludedButlers` service on path `/serviceExcludedButlers`
const createService = require('feathers-knex');
const hooks = require('./service-excluded-butlers.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceExcludedButlers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceExcludedButlers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceExcludedButlers');

  service.hooks(hooks);
};
