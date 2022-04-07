const createService = require('feathers-knex');
const hooks = require('./client-value-settings.hooks');
import {docs} from './client-value-settings.docs';


module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'clientValueSettings',
    Model,
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  app.use('/clientValueSettings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('clientValueSettings');

  processedService.hooks(hooks);
};
