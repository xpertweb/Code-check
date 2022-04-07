const logger = require('winston');
const _ = require('lodash');

const calculateActiveClients = require('../../../helpers/calculate-active-clients');

module.exports = function () {
  return async function calculateChurnPerClientRating(hook) {
    if (hook.result && hook.result.serviceId) {

      const allButlersOfThisService = await hook.app.service('serviceButlers').find({
        query:{
          serviceId: hook.result.serviceId
        }
      });

      const allButlerIdsToProcess = allButlersOfThisService.map(x => x.butlerId);
      if (!allButlerIdsToProcess.find(x=> x == hook.result.butlerId)){
        // this means the butler got removed, process him too
        allButlerIdsToProcess.push(hook.result.butlerId);
      }

      await calculateActiveClients(
        hook.app.get('knexClient'),
        _.get(hook, 'params.headers.authorization'),
        allButlerIdsToProcess
      );
    }
    return hook;
  };
};
