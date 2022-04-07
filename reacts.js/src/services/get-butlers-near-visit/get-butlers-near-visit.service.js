const hooks = require('./get-butlers-near-visit.hooks');
const createService = require('./get-butlers-near-visit.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'getButlersNearVisit',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/getButlersNearVisit', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('getButlersNearVisit');

  service.hooks(hooks);
};
