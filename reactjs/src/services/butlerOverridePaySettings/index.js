const createService = require('feathers-knex');
const hooks = require('./butlerOverridePaySettings.hooks');
import {docs} from './butlerOverridePaySettings.docs';


module.exports = function () 
{
  const app = this;

  const paginate = app.get('paginate');


  const Model = app.get('knexClient');

  const options = 
  {
    name: 'butlerOverridePaySettings',
    Model,
    paginate,
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/butlerOverridePaySettings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('butlerOverridePaySettings');

  processedService.hooks(hooks);
};
