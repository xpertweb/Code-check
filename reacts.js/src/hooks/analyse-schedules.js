const { serialize, discard } = require('feathers-hooks-common');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function analyseSchedules (hook) {
    const analyseSchedule = schedule => {
      if (schedule.trunc) {
        return {
          status: 'error',
          message: 'Schedule has too many visits to be computed (extra visits have been truncated)'
        };
      }

      if (schedule.butlerAvailable === false) {
        return {
          status: 'warning',
          message: 'Butler is not available or has incomplete address information on this day'
        };
      }
      

      if (schedule.constraintsSatisfied === false) {
        return {
          status: 'warning',
          message: 'Constraint has been violated'
        };
      }

      return {
        status: 'ok'
      };
    };

    const doSerialize = serialize({
      computed: {
        analysis: analyseSchedule
      }
    });

    return Promise.resolve(discard('_computed')(doSerialize(hook)));
  };
};
