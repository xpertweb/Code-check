const createService = require('./recalculate-churns-per-client-ratings.class'); //we use schedule service
const hooks = require('./recalculate-churns-per-client-ratings.hooks');
import {docs} from './recalculate-churns-per-client-ratings.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'recalculateChurnsPerClientRatings',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/recalculateChurnsPerClientRatings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('recalculateChurnsPerClientRatings');

  processedService.hooks(hooks);
};
