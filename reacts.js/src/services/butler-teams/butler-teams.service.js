// Initializes the `butlerTeams` service on path `/butler-teams`
const { ButlerTeams } = require('./butler-teams.class');
const hooks = require('./butler-teams.hooks');

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/butlerTeams', new ButlerTeams(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('butlerTeams');

  service.hooks(hooks);
};
