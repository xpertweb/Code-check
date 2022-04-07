// Initializes the `butler-feedback-appeals` service on path `/butlerFeedbackAppeals`
const hooks = require('./visit-modification-requests.hooks');
const createService = require('./visit-modification-requests.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'visitModificationRequests',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/visitModificationRequests', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('visitModificationRequests');

  service.hooks(hooks);
};
