// Initializes the `serviceInvoicing` service on path `/serviceInvoicing`
const createService = require('feathers-knex');
const hooks = require('./service-invoicing.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceInvoicing',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceInvoicing', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceInvoicing');

  service.hooks(hooks);
};
