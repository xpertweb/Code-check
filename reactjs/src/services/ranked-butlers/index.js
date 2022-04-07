const createService = require('./ranked-butlers.class'); //we use schedule service
const hooks = require('./ranked-butlers.hooks');
import {docs} from './ranked-butlers.docs';

// BUTLERS RANKED FOR MSP (MANAGED SCHEDULE PLAN)
module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'rankedButlers',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/rankedButlers',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('rankedButlers');

  processedService.hooks(hooks);
};
