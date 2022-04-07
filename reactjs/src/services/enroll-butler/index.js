// Initializes the `butlers` service on path `/butlers`
const createService = require('./enroll-butler.class'); //we use schedule service
const hooks = require('./enroll-butler.hooks');
import {docs} from './enroll-butler.docs';

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'enrollButler',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/enrollButler', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('enrollButler');
  service.docs = docs;
  service.hooks(hooks);
};
