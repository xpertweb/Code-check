// Initializes the `butler-disputes` service on path `/butlerDisputes`
const hooks = require('./butler-disputes.hooks');
const createService = require('./butler-disputes.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerDisputes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerDisputes', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('butlerDisputes');

  service.hooks(hooks);
};
