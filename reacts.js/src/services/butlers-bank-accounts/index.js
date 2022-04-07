const createService = require('./butlers-bank-accounts.class'); //we use schedule service
const hooks = require('./butlers-bank-accounts.hooks');
import {docs} from './butlers-bank-accounts.docs';

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerBankAccounts',
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/butlerBankAccounts',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('butlerBankAccounts');

  processedService.hooks(hooks);
};
