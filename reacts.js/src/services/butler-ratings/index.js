const createService = require('./butler-ratings.class'); //we use schedule service
const hooks = require('./butler-ratings.hooks');
import {docs} from './butler-ratings.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerRatings',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/butlerRatings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('butlerRatings');

  processedService.hooks(hooks);
};
