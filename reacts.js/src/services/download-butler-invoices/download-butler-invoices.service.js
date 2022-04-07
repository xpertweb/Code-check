// Initializes the `visits` service on path `/visits`
const createService = require('./download-butler-invoices.class');
const hooks = require('./download-butler-invoices.hooks');

module.exports = (app) => {
  const paginate = app.get('paginate');
  const Model = app.get('knexClient');

  const options = {
    name: 'downloadButlerInvoices',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/downloadButlerInvoices', createService(options), function(req, res){
    const {status, response} = res.data || {};
    if (status === 'success'){
      res.send(response);
    }else{
      res.status(404).send(response);
    }
  });

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('downloadButlerInvoices');

  service.hooks(hooks);
};
