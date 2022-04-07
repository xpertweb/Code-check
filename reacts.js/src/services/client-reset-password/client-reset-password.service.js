const hooks = require('./client-reset-password.hooks');
const createService = require('./client-reset-password.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'clientResetPassword',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clientResetPassword', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('clientResetPassword');

  service.hooks(hooks);
};
