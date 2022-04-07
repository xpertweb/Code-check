// const calculateScoresForButler = require('../../../helpers/calculate-scores-for-butler');

const _ = require('lodash');

module.exports = function () {
  return async function getUnallocatedButler(hook) {
    const id = _.get(hook, 'result.butlerId');
    if (id){
      await hook.app.service('recalculateRatings').patch(id, {});
    }
    return hook;
  };
};

