// Initializes the `butler-feedback-appeals` service on path `/butlerFeedbackAppeals`
const hooks = require('./butler-feedback-appeals.hooks');
const createService = require('./butler-feedback-appeals.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerFeedbackAppeals',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerFeedbackAppeals', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('butlerFeedbackAppeals');

  service.hooks(hooks);
};
