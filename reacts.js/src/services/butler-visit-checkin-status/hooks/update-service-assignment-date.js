const _ = require('lodash');
const winston = require('winston');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function(hook) {
    if (hook.data && hook.params.user.roles.indexOf('butler') > -1) {
      if (hook.data.butlerConfirmsCannotAttendVisit) {
        await setVisitAssignedToButlerDateTime(hook);
      }
    }

    return hook;
  };
};

// TODO: we can optimize this with a single sql query
async function setVisitAssignedToButlerDateTime(hook){
  const knex = hook.app.get('knexClient');
  const visitPlan = await hook.app.service('visitPlans').get(hook.data.visitPlanId);
  const {serviceId} = visitPlan;

  const serviceButlers = await knex('serviceButlers').select('dateTimeCreated').where({
    butlerId: hook.data.butlerId,
    serviceId: serviceId
  })
  .orderBy('activeFrom', 'desc')
  .limit(1);

  const dateTimeCreated = _.first(serviceButlers).dateTimeCreated;
  if (dateTimeCreated){
    await knex('butlerVisitCheckinStatus')
      .where('butlerId', hook.data.butlerId)
      .andWhere('visitPlanId', hook.data.visitPlanId)
      .andWhere('visitDate', hook.data.visitDate)
      .update({visitAssignedToButlerDateTime: dateTimeCreated});
  }
}
