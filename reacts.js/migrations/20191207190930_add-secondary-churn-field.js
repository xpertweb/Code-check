
exports.up = async function(knex, Promise) {
  await knex.schema.table('serviceChurns', function (table) {
    table.uuid('secondaryReasonId');
    table.foreign('secondaryReasonId').references('secondaryChurnCategories.id');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('serviceChurns', function (table) {
    table.dropColumn('secondaryReasonId');
  });
};

