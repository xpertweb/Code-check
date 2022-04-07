const createService = require('feathers-knex');
const hooks = require('./allocation-settings.hooks');
import {docs} from './allocation-settings.docs';


module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'allocationSettings',
    Model,
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  app.use('/allocationSettings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('allocationSettings');

  processedService.hooks(hooks);
};
