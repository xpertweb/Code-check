// Initializes the `churned-clients-for-lead-pool` service on path `/churned-clients-for-lead-pool`
// const createService = require('feathers-knex');
const createService = require('./churned-clients-for-lead-pool.class');
const hooks = require('./churned-clients-for-lead-pool.hooks');

module.exports = (app) => {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'churned-clients-for-lead-pool',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/churned-clients-for-lead-pool', createService(options));
  
  // Get our initialized service so that we can register hooks
  const service = app.service('churned-clients-for-lead-pool');

  service.hooks(hooks);
};
