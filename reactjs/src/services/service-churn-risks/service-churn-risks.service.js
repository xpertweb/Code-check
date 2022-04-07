// Initializes the `serviceChurnRisks` service on path `/serviceChurnRisks`
const createService = require('feathers-knex');
const hooks = require('./service-churn-risks.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceChurnRisks',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceChurnRisks', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceChurnRisks');

  service.hooks(hooks);
};
