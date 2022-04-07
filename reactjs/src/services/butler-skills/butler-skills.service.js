// Initializes the `butlerSkills` service on path `/butler-skills`
const createService = require('feathers-knex');
const hooks = require('./butler-skills.hooks');

module.exports = function(app) {
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'butlerSkills',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerSkills', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerSkills');

  service.hooks(hooks);
};
