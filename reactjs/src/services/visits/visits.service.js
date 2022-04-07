// Initializes the `visits` service on path `/visits`
const createService = require('./visits.class.js');
const hooks = require('./visits.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'visits',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/visits', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('visits');

  service.hooks(hooks);
};
