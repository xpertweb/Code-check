// Initializes the `legacyItems` service on path `/legacyItems`
const createService = require('./legacy-items.class.js');
const hooks = require('./legacy-items.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'legacyItems',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/legacyItems', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('legacyItems');

  service.hooks(hooks);
};
