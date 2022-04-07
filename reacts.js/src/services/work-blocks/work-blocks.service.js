// Initializes the `workBlocks` service on path `/work-blocks`
const createService = require('feathers-knex');
const hooks = require('./work-blocks.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'workBlocks',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workBlocks', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('workBlocks');

  service.hooks(hooks);
};
