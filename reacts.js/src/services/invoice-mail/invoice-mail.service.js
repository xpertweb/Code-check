// Initializes the `visits` service on path `/visits`
const createService = require('./invoice-mail.class.js');
const hooks = require('./invoice-mail.hooks.js');

module.exports = (app) => {
  const paginate = app.get('paginate');
  const Model = app.get('knexClient');

  const options = {
    name: 'mail-invoice',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/mail-invoice', createService(options));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('mail-invoice');

  service.hooks(hooks);
};
