const createService = require('feathers-knex');
const hooks = require('./butler-visit-checkin-status.hooks');
import {docs} from './butler-visit-checkin-status.docs';


module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerVisitCheckinStatus',
    Model,
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  app.use('/butlerVisitCheckinStatus',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('butlerVisitCheckinStatus');

  processedService.hooks(hooks);
};
