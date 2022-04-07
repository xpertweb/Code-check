
exports.up = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.date('dateOfBirth');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('dateOfBirth');
  });
};





