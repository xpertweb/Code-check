// Initializes the `serviceReschedule` service on path `/serviceReschedule`
const createService = require('feathers-knex');
const hooks = require('./service-reschedule.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceReschedule',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceReschedule', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceReschedule');

  service.hooks(hooks);
};
