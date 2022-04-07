// Initializes the `serviceButlerNoShow` service on path `/service-butler-no-show`
const createService = require('feathers-knex');
const hooks = require('./service-butler-no-show.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceButlerNoShow',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/serviceButlerNoShow', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('serviceButlerNoShow');

  service.hooks(hooks(app));
};