// Initializes the `butler-churns-custom` service on path `/butlerChurnsCustom`
const createService = require('./butler-churns-custom.class.js');
const hooks = require('./butler-churns-custom.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'butler-churns-custom',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/butlerChurnsCustom', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('butlerChurnsCustom');

  service.hooks(hooks);

};
