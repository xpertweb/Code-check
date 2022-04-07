// Initializes the `butlerAndButlerTeams` service on path `/butlerAndButlerTeams`
const { ButlerAndButlerTeams } = require('./butler-and-butler-teams.class');
const hooks = require('./butler-and-butler-teams.hooks');

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/butlerAndButlerTeams', new ButlerAndButlerTeams(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('butlerAndButlerTeams');

  service.hooks(hooks);
};
