const createService = require('./managed-schedule.class'); //we use schedule service
const hooks = require('./managed-schedule.hooks');
import {docs} from './managed-schedule.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'managedSchedule',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/managedSchedule',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('managedSchedule');

  processedService.hooks(hooks);
};
