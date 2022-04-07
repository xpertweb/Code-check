// Initializes the `clientToDoItems` service on path `/clientToDoItems`
// const createService = require('feathers-knex');
const hooks = require('./operators-to-do-items.hooks');
const createService = require('./operators-to-do.items.class');


module.exports = function() {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'operatorsToDoItems',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/operatorsToDoItems', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('operatorsToDoItems');
  service.hooks(hooks(app));
};
