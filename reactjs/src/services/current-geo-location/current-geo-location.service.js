const hooks = require('./current-geo-location.hooks');
const createService = require('./current-geo-location.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'currentGeoLocation',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/currentGeoLocation', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('currentGeoLocation');

  service.hooks(hooks);
};
