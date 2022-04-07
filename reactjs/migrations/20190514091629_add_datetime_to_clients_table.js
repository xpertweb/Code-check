
exports.up = async function(knex) {
  await knex.schema.table('clients', function (table) {
    table.datetime('dateTimeCreated');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('dateTimeCreated');
  });
};
