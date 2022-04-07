const createService = require('./recalculate-ratings.class'); //we use schedule service
const hooks = require('./recalculate-ratings.hooks');
import {docs} from './recalculate-ratings.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'recalculateRatings',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/recalculateRatings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('recalculateRatings');

  processedService.hooks(hooks);
};
