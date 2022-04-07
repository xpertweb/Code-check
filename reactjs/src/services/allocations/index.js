const createService = require('./allocations.class'); //we use schedule service
const hooks = require('./allocations.hooks');
import {docs} from './allocations.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'allocations',
    paginate,
    butlerQuery: 
    { 
      query : 
      {
        firstName : 'ALLOCATE'
      }
    }
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/allocations',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('allocations');

  processedService.hooks(hooks);
};
