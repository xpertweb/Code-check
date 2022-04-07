// Initializes the `butlerTeamsAdministrators` service on path `/butlerTeamsAdministrators`
const { ButlerTeamsAdministrators } = require('./butler-teams-administrators.class');
const createModel = require('../../models/butler-teams-administrators.model');
const hooks = require('./butler-teams-administrators.hooks');

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/butlerTeamsAdministrators', new ButlerTeamsAdministrators(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('butlerTeamsAdministrators');

  service.hooks(hooks);
};
