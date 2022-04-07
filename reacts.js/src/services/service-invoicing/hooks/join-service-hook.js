module.exports = function (options = {}) { 
  return function joinService (hook) {
    if(hook.params.user.roles[0] == 'client') {
      if (!hook.params.query) {
        return hook;
      }

      let outerQuery = hook.service.createQuery({ query: hook.params.query });
      let query = hook.service.createQuery();
      const localTable = hook.service.table;

      query.leftJoin('services', `${localTable}.serviceId`, `services.id`)
           .select('clientId')
           .where(`services.clientId`,hook.params.user.id);
           
      hook.params.knex = outerQuery.with(localTable, hook.app.get('knexClient').raw(query));
    }
    return hook;
  };
};
