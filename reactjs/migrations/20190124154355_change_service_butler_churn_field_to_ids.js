
exports.up = function(knex, Promise) {
  return knex.schema.table('serviceButlers', function (table) {
    table.dropColumn('churnReason');
    table.uuid('churnReasonId');
    table.foreign('churnReasonId').references('serviceButlerChurnCategories.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('serviceButlers', function (table) {
    table.dropColumn('churnReasonId');
    table.string('churnReason');
  });
};
