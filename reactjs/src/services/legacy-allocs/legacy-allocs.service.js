// Initializes the `legacy-allocs` service on path `/legacyAllocs`
const createService = require('./legacy-allocs.class.js');
const hooks = require('./legacy-allocs.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'legacyAllocs',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/legacyAllocs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('legacyAllocs');

  service.hooks(hooks);
};
