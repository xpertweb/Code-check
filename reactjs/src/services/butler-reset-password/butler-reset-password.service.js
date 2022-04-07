const hooks = require('./butler-reset-password.hooks');
const createService = require('./butler-reset-password.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerResetPassword',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerResetPassword', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('butlerResetPassword');

  service.hooks(hooks);
};
