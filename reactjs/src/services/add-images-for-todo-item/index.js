const createService = require('./add-images-for-todo-item.class'); //we use schedule service
const hooks = require('./add-images-for-todo-item.hooks');
import {docs} from './add-images-for-todo-item.docs';


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'addImagesForToDoItem',
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/addImagesForToDoItem',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('addImagesForToDoItem');

  processedService.hooks(hooks);
};
