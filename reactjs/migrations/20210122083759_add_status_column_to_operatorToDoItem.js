exports.up = async function(knex, Promise) {
  return await knex.schema.table('operatorsToDoItems', function(table) {
    table.string('status');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('operatorsToDoItems', function(table) {
    table.dropColumn('status');
  });
};
