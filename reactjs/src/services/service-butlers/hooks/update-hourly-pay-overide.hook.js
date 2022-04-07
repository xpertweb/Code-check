const logger = require('winston');

const getServiceRequiredKeys = require('../../../helpers/get-service-required-keys');

const getHighestHourlyPayOverride = require('../../../helpers/get-highest-hourly-pay-override');

module.exports = function () 
{
  return async function updateHourlyPayOverride(hook) 
  {
    const butlerOverridePaySettings = await hook.app.service('butlerOverridePaySettings').find({});

    const service = await hook.app.service('services').find({query:{id:hook.result.serviceId}});

    if(butlerOverridePaySettings.length > 0 && service.length > 0 && !hook.result.hourlyPayOverride)
    {
      let ServiceRequiredKeys = getServiceRequiredKeys(service[0]);

      let hourlyPayOverride = getHighestHourlyPayOverride(butlerOverridePaySettings[0],ServiceRequiredKeys);

      if (!hourlyPayOverride || hook.result.hourlyPayOverride == 0){
        hook.result.hourlyPayOverride = null;
      } else {
        hook.result.hourlyPayOverride = hourlyPayOverride;
      }
      
    }

    return hook;
  };
};