const createService = require('./recalculate-all-butlers-active-clients.class'); //we use schedule service
const hooks = require('./recalculate-all-butlers-active-clients.hooks');
import {docs} from './recalculate-all-butlers-active-clients.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'recalculateAllButlersActiveClients',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/recalculateAllButlersActiveClients',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('recalculateAllButlersActiveClients');

  processedService.hooks(hooks);
};
