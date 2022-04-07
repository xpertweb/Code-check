
exports.up = async function(knex) {
  await knex.schema.table('butlers', function (table) {
    table.decimal('churnsPerClientRating');
    table.integer('activeClients');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('churnsPerClientRating');
    table.dropColumn('activeClients');
  });
};
