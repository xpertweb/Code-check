const createService = require('./get-multiple-client-invoice-settings.class'); //we use schedule service
const hooks = require('./get-multiple-client-invoice-settings.hooks');
import {docs} from './get-multiple-client-invoice-settings.docs';

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'getMultipleClientInvoiceSettings',
    paginate
  };

  let service = createService(options);
  service.docs = docs;
  
  app.use('/getMultipleClientInvoiceSettings',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('getMultipleClientInvoiceSettings');

  processedService.hooks(hooks);
};
