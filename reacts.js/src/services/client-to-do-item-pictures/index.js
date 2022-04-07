// Initializes the `clientToDoPictures` service on path `/clientToDoPictures`
const createService = require('feathers-knex');
const hooks = require('./client-to-do-item-pictures.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'clientToDoItemPictures',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clientToDoItemPictures', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('clientToDoItemPictures');

  service.hooks(hooks);
};
