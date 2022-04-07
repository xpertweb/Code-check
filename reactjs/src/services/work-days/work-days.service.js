// Initializes the `workDays` service on path `/workDays`
const createService = require('./work-days.class.js');
const hooks = require('./work-days.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'workDays',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workDays', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('workDays');

  service.hooks(hooks);
};
