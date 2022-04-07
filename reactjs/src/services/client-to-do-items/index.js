// Initializes the `clientToDoItems` service on path `/clientToDoItems`
const createService = require('feathers-knex');
const hooks = require('./client-to-do-items.hooks');

module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'clientToDoItems',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clientToDoItems', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('clientToDoItems');
  service.hooks(hooks(app));
};
