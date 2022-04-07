const createService = require('./client-schedules.class'); //we use schedule service
const hooks = require('./client-schedules.hooks');
import {docs} from './client-schedules.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'clientSchedules',
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/clientSchedules',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('clientSchedules');

  processedService.hooks(hooks);
};
