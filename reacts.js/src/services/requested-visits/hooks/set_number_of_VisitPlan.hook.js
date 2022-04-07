const { BadRequest } = require('@feathersjs/errors');

function increaseNoOfRequests() {
  return async function (hook) {
    if (hook.params.user) {
      const butlerInfo = await hook.app.service('butlers').find({
        query: {
          id: hook.result.butlerId
        }
      })
      const {visitPlanId} = hook.result;
      const knex = hook.app.get('knexClient');
      await knex.raw(`UPDATE public."visitPlans" SET  "numberOfRequests"="numberOfRequests"+ ${1}, "totalRatingOfButlersWhoRequested"=coalesce("totalRatingOfButlersWhoRequested", ${0})+ `+ butlerInfo[0].rating +` WHERE id='${visitPlanId}';`);
    }
    return Promise.resolve(hook);
  };
}
function decreaseNoOfRequests() {
  return async function (hook) {
    if (hook.params.user) {
      const butlerInfo = await hook.app.service('butlers').find({
        query: {
          id: hook.result.butlerId
        }
      })
      const {visitPlanId} = hook.result;
      const knex = hook.app.get('knexClient');
      await knex.raw(`UPDATE public."visitPlans" SET  "numberOfRequests"="numberOfRequests"- ${1}, "totalRatingOfButlersWhoRequested"="totalRatingOfButlersWhoRequested"- `+ butlerInfo[0].rating +` WHERE id='${visitPlanId}';`);
    }
    return Promise.resolve(hook);
  };
}

function resetNoOfRequests() {
  return async function (hook) {
    if (hook.params.user) {
      const {serviceId} = hook.result;
      const knex = hook.app.get('knexClient');
      await knex.raw(`UPDATE public."visitPlans" SET  "numberOfRequests"=${0}, "totalRatingOfButlersWhoRequested"=${0} WHERE "serviceId"='${serviceId}';`);
    }
    return Promise.resolve(hook);
  };
}
module.exports ={
  increaseNoOfRequests,
  decreaseNoOfRequests,
  resetNoOfRequests
}
