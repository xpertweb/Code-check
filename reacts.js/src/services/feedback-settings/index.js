const createService = require('feathers-knex');
const hooks = require('./feedback-settings.hooks');
import {docs} from './feedback-settings.docs';


module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'feedbackSettings',
    Model,
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  app.use('/feedbackSettings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('feedbackSettings');

  processedService.hooks(hooks);
};
