
exports.up = async function(knex) {
  await knex.schema.table('clients', function (table) {
    table.enu('preferredContact', ['m', 'e']).defaultTo('m');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('preferredContact');
  });
};
