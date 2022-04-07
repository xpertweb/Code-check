const createService = require('./visit-plans-starting-on-date.class'); //we use schedule service
const hooks = require('./visit-plans-starting-on-date.hooks');
import {docs} from './visit-plans-starting-on-date.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'visitPlansStartingOnDate',
    paginate,
  };
  

  let service = createService(options);
  service.docs = docs;
  
  app.use('/visitPlansStartingOnDate',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('visitPlansStartingOnDate');

  processedService.hooks(hooks);
};
