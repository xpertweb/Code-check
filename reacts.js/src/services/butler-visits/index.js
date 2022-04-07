const createService = require('./butler-visits.class'); //we use schedule service
const hooks = require('./butler-visits.hooks');
const docs = require('./butler-visits.docs');


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerVisits',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/butlerVisits',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('butlerVisits');

  processedService.hooks(hooks);
};
