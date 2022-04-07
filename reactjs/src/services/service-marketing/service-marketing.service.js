// Initializes the `serviceMarketing` service on path `/serviceMarketing`
const createService = require('feathers-knex');
const hooks = require('./service-marketing.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceMarketing',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceMarketing', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceMarketing');

  service.hooks(hooks);
};
