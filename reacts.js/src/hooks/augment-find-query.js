
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
    if (!hook.params.query) {
      return hook;
    }

    const instant = hook.params.query.joinInstant;
    if (hook.params.query.joinInstant) {
      delete hook.params.query.joinInstant;
    }

    let outerQuery = hook.service.createQuery({ query: hook.params.query });
    let query = hook.service.createQuery();

    const localTable = hook.service.table;

    const distinct = options.some(opt => {
      return opt.type === 'temporalJoin';
    });

    if (distinct) {
      query
        .clearSelect()
        .distinct(hook.app.get('knexClient').raw(`on (${localTable}.id) ${localTable}.*`));
    }

    options.forEach(opt => {
      if (opt.type === 'leftJoin') {
        query
          .leftJoin(opt.with, `${localTable}.${opt.localId}`, `${opt.with}.${opt.foreignId}`)
          .select(opt.select.map(field => `${opt.with}.${field} as ${opt.asPrefix}.${field}`));
      }
      if (opt.type === 'temporalJoin') {
        if (!opt.through) {
          query
            .leftJoin(function() {
              this
                .select('*')
                .from(opt.with)
                .where(`${opt.with}.${opt.instantField}`, '<=', instant || new Date())
                .as(opt.asPrefix);
            }, `${opt.asPrefix}.${opt.foreignId}`, `${localTable}.${opt.localId}`)
            .select(opt.select.map(field => `${opt.asPrefix}.${field} as ${opt.asPrefix}.${field}`))
            .orderBy(`${localTable}.id`)
            .orderBy(`${opt.asPrefix}.${opt.instantField}`, 'desc');
        } else {
          const throughSelect = (opt.throughTableSelect || [])
            .map((column) => `${opt.through}.${column} as ${opt.through}_${column}`);

          const finalSelection = (opt.throughTableSelect || [])
            .map(column => `${opt.asPrefix}.${opt.through}_${column} as ${opt.through}.${column}`);
          query
            .leftJoin(function() {
              this
                .select([
                  `${opt.through}.${opt.throughForeignId} as ${opt.throughForeignId}`,
                  `${opt.through}.${opt.instantField} as ${opt.instantField}`,
                  `${opt.with}.*`
                ].concat(throughSelect))
                .from(opt.through)
                .leftJoin(opt.with, `${opt.with}.${opt.foreignId}`, `${opt.through}.${opt.throughLocalId}`)
                .where(`${opt.through}.${opt.instantField}`, '<=', instant || new Date())
                .as(opt.asPrefix);
            }, `${opt.asPrefix}.${opt.throughForeignId}`, `${localTable}.${opt.localId}`)
            .select(opt.select.map(field => `${opt.asPrefix}.${field} as ${opt.asPrefix}.${field}`).concat(finalSelection))
            .orderBy(`${localTable}.id`)
            .orderBy(`${opt.asPrefix}.${opt.instantField}`, 'desc');
        }
      }
    });

    hook.params.knex = outerQuery
      .with(localTable, hook.app.get('knexClient').raw(query));

    return hook;
  };
};
