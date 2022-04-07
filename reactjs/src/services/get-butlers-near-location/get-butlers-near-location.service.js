const hooks = require('./get-butlers-near-location.hooks');
const createService = require('./get-butlers-near-location.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'getButlersNearLocation',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/getButlersNearLocation', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('getButlersNearLocation');

  service.hooks(hooks);
};
