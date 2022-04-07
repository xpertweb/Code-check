import _ from 'lodash';
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function changeHourlyRateOverrideValue (hook) {
    hook.data['hourlyRateOverride'] = _.get(hook.data, 'hourlyRateOverride') || 39;
    hook.data['numberOfRequests'] = _.get(hook.data, 'numberOfRequests') || 0;
    return Promise.resolve(hook);
  };
};
