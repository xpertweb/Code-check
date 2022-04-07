// Initializes the `schedules` service on path `/schedules`
const createService = require('./schedules.class.js');
const hooks = require('./schedules.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'schedules',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/schedules', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('schedules');

  service.hooks(hooks);
};
