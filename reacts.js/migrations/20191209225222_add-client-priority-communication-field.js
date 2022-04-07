
exports.up = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.boolean('priorityCommunications').defaultTo(false);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('priorityCommunications');
  });
};
