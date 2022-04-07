// Initializes the `butler-feedback-appeals` service on path `/clientActiveButlers`
const hooks = require('./client-active-butlers.hooks');
const createService = require('./client-active-butlers.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'clientActiveButlers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clientActiveButlers', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('clientActiveButlers');

  service.hooks(hooks);
};
