// Initializes the `butlers` service on path `/butlers`
const createService = require('./butler-sign-up.class'); //we use schedule service
const hooks = require('./butler-sign-up.hooks');
import {docs} from './butler-sign-up.docs';

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerSignUp',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerSignUp', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerSignUp');
  service.docs = docs;
  service.hooks(hooks);
};
