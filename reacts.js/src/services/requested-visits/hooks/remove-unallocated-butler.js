
// Note: This module is a knex specific version of the populate() hook that comes
// with FeathersJS (with some additions). The reason for this is it is far more
// efficient to use actual joins on the db layer than simulate them on the
// application layer.

// 'temporalJoin' replicates the hook populate-current-temporal-ref() with the
// intent of selecting one record from the many side of a one-to-many relationship
// based on a time event (i.e. most recent entry before a given date). It is far
// more efficient to use this hook since a database native join is used.

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function augmentFindQuery (hook) {
    let outerQuery = hook.service.createQuery({ query: hook.params.query });
    let query = hook.service.createQuery();
    const localTable = hook.service.table;
    if(hook.params.query.visitPlanId) {
      options.forEach(opt => {
        if (opt.type === 'leftJoin') {
          query
            .leftJoin(opt.with, `${localTable}.${opt.localId}`, `${opt.with}.${opt.foreignId}`)
            .select(opt.select.map(field => `${opt.with}.${field} as ${opt.asPrefix}.${field}`))
            .whereNot(`${opt.asPrefix}.firstName`, 'ALLOCATE');
        }
      });
    }
    hook.params.knex = outerQuery
      .with(localTable, hook.app.get('knexClient').raw(query));
    return hook;
  };
};
