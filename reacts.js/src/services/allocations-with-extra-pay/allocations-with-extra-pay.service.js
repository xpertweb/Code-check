// Initializes the `allocations-with-extra-pay` service on path `/allocations-with-extra-pay`
const { AllocationsWithExtraPay } = require('./allocations-with-extra-pay.class');
const hooks = require('./allocations-with-extra-pay.hooks');

module.exports = function (app) {
  const options = {
  	name:'allocations-with-extra-pay',
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/allocations-with-extra-pay', new AllocationsWithExtraPay(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('allocations-with-extra-pay');

  service.hooks(hooks);
};
