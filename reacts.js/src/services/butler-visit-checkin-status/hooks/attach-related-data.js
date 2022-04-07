function extractIds(results){
  const butlerIds = [];
  const visitPlanIds = [];

  for (const result of results){
    butlerIds.push(result.butlerId);
    visitPlanIds.push(result.visitPlanId);
  }

  return {butlerIds, visitPlanIds};
}


function makeHashmap(store, item){
  store[item.id] = item;
  return store;
}


module.exports = function () {
  return async (hook) => {
    if (!Array.isArray(hook.result)){
      return hook;
    }

    const knex = hook.app.get('knexClient');
    const {butlerIds, visitPlanIds} = extractIds(hook.result);
    const butlers = (await knex('butlers')
      .select('id', 'firstName', 'lastName')
      .whereIn('id', butlerIds))
      .reduce(makeHashmap, {}); // for easy lookup

    const visitPlans = (await knex('visitPlans')
      .select('id', 'serviceId')
      .whereIn('id', visitPlanIds))
      .reduce(makeHashmap, {}); // for easy lookup

    for (const result of hook.result) {
      result['butler'] = butlers[result.butlerId];
      result['visitPlan'] = visitPlans[result.visitPlanId];
    }

    return hook;
  };
};
