exports.up = async function (knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.string('resetShortToken');
    table.string('verifyShortToken');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('resetShortToken');
    table.dropColumn('verifyShortToken');
  });
};