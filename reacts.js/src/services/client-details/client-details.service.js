// Initializes the `clientDetails` service on path `/clientDetails`
const createService = require('./client-details.class');
const hooks = require('./client-details.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'clientDetails',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clientDetails', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('clientDetails');

  service.hooks(hooks);
};
