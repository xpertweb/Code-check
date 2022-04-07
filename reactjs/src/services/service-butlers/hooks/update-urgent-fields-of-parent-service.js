const logger = require('winston');

const _ = require('lodash');

module.exports = function () 
{
  return async function updateUrgentFieldsOfParentService(hook) 
  {
    const serviceId= _.get(hook,'data.serviceId');

    await hook.app.service('services').patch(serviceId,{urgentExtraPayProvided:false,urgentExtraPayAmount:0});

    return hook;
  };
};