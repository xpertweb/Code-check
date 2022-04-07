
exports.up = async function(knex) {
  await knex.schema.table('butlers', function (table) {
    table.enu('preferredContact', ['m', 'e']).defaultTo('m');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('preferredContact');
  });
};
