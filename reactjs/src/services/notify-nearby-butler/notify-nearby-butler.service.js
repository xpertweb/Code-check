const hooks = require('./notify-nearby-butler.hooks');
const createService = require('./notify-nearby-butler.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'notifyNearByButlers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/notifyNearByButlers', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('notifyNearByButlers');

  service.hooks(hooks);
};
