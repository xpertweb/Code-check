const createService = require('feathers-knex');
const hooks = require('./allocation-cancellation.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');

  const options = {
    name: 'allocationCancellation',
    Model
  };

  // Initialize our service with any options it requires
  app.use('/allocationCancellation', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('allocationCancellation');

  service.hooks(hooks);
};
