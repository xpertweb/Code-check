// Initializes the `butlers` service on path `/butlers`
const createService = require('./upload-butler-police-check.class'); //we use schedule service
const hooks = require('./upload-butler-police-check.hooks');
import {docs} from './upload-butler-police-check.docs';

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'uploadButlerPoliceCheck',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploadButlerPoliceCheck', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploadButlerPoliceCheck');
  service.docs = docs;
  service.hooks(hooks);
};
