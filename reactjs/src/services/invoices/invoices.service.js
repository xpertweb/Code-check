// Initializes the `visits` service on path `/visits`
const createService = require('./invoices.class.js');
const hooks = require('./invoices.hooks.js');

module.exports = (app) => {
  const paginate = app.get('paginate');
  const Model = app.get('knexClient');

  const options = {
    name: 'invoices',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/invoices', createService(options));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('invoices');

  service.hooks(hooks);
};
