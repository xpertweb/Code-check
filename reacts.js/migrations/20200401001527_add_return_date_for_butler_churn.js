
exports.up = async function(knex, Promise) {
    return await knex.schema.table('butlerChurns', function(t) {
        t.datetime('returnDate');
      });
};

exports.down = async function(knex, Promise) {
    return await knex.schema.table('butlerChurns', function(t) {
        t.dropColumn('returnDate');
      });
};
