const { BadRequest } = require('@feathersjs/errors');

module.exports = function () {
  return async function (hook) {
    if (hook.params.user) {
      const {visitPlanId} = hook.data;
      const knex = hook.app.get('knexClient');
      const requestRecords = await knex('visitModificationRequests').where({'visitPlanId': visitPlanId, 'status': 'pending'});
      if (requestRecords.length > 0) {
        return Promise.reject(new BadRequest('Request to modify this visit already exists.'));
      }
    }
    return Promise.resolve(hook);
  };
};
