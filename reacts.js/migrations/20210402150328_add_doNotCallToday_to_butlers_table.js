
exports.up = async function (knex, Promise) {
    return await knex.schema.table('butlers', function (t) {
        t.datetime('doNotCallToday');
    });
  };
  
  exports.down = async function (knex, Promise) {
    return await knex.schema.table('butlers', function (t) {
      t.dropColumn('doNotCallToday');
    });
  };
  