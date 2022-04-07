// Initializes the `butlerBankDetails` service on path `/butlerBankDetails`
const createService = require('feathers-knex');
const hooks = require('./butler-bank-details.hooks');
import {docs} from './butler-bank-details.docs';

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerBankDetails',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerBankDetails', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerBankDetails');
  service.docs = docs;

  service.hooks(hooks);
};
