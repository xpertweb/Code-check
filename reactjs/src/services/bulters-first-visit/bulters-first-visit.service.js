// Initializes the `butlersFirstVisit` service on path `/butlersFirstVisit`
const createService = require('./bulters-first-visit.class');
const hooks = require('./bulters-first-visit.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');

  const options = {
    name: 'butlersFirstVisit',
    Model
  };

  // Initialize our service with any options it requires
  app.use('/butlersFirstVisit', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlersFirstVisit');

  service.hooks(hooks);
};
