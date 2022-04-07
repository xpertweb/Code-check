const createService = require('feathers-knex');
const hooks = require('./service-call-history.hooks');
import {docs} from './service-call-history.docs';


module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'serviceCallHistory',
    Model,
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  app.use('/serviceCallHistory',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('serviceCallHistory');

  processedService.hooks(hooks);
};
