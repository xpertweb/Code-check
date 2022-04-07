// Initializes the `searchServices` service on path `/searchServices`
const createService = require('./search-services.class');
const hooks = require('./search-services.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'searchServices',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/searchServices', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('searchServices');

  service.hooks(hooks);
};
