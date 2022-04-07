const createService = require('./public-reviews.class'); //we use schedule service
const hooks = require('./public-reviews.hooks');
import {docs} from './public-reviews.docs';

// BUTLERS RANKED FOR MSP (MANAGED SCHEDULE PLAN)
module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'publicReviews',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/publicReviews',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('publicReviews');

  processedService.hooks(hooks);
};
