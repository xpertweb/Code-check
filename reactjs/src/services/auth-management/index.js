// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
const hooks = require('./auth-management.hooks');
const notifier = require('./notifier');

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.configure(authManagement(Object.assign({
    delay: 864000000, //for 10 days extension of verify signup, token expiry
    resetDelay: 21600000 // for 6 hour extension of reset pwd, token expiry 
  },notifier(app),{
    service:'/clients',
    identifyUserProps: ["_id", "phone", "email"],
  })));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authManagement');

  service.hooks(hooks);
};