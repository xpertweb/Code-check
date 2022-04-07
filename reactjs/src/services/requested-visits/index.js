const createService = require('feathers-knex');
const hooks = require('./requested-visits.hooks');
import {docs} from './requested-visits.docs';


module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'requestedVisits',
    Model,
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  app.use('/requestedVisits',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('requestedVisits');

  processedService.hooks(hooks);
};
