const hooks = require('./near-by-butlers-visit.hooks');
const createService = require('./near-by-butlers-visit.class');

module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'nearByButlersVisit',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/nearByButlersVisit', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('nearByButlersVisit');

  service.hooks(hooks);
};
