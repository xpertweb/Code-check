// Initializes the `butlers` service on path `/butlers`
const createService = require('./upload-butler-resume.class'); //we use schedule service
const hooks = require('./upload-butler-resume.hooks');
import {docs} from './upload-butler-resume.docs';

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'uploadButlerResume',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploadButlerResume', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploadButlerResume');
  service.docs = docs;
  service.hooks(hooks);
};
