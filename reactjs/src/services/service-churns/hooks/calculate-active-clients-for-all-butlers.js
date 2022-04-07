const calculateActiveClients = require('../../../helpers/calculate-active-clients');

module.exports = function () {
  return async function calculateActiveClientsForAllButlers(hook) {

    if (hook.result && hook.result.serviceId) {


      const allButlersOfThisService = await hook.app.service('serviceButlers').find({
        query:
        {
          serviceId: hook.result.serviceId
        }
      });

      const knex = hook.app.get('knexClient');


      // for better performance we can remove await
      await calculateActiveClients(knex, allButlersOfThisService.map(x => x.butlerId));
    }

    return hook;
  };
};

