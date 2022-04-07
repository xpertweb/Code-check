const createService = require('feathers-knex');
const hooks = require('./churn-per-client-settings.hooks');
import {docs} from './churn-per-client-settings.docs';


module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'churnPerClientSettings',
    Model,
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  app.use('/churnPerClientSettings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('churnPerClientSettings');

  processedService.hooks(hooks);
};
