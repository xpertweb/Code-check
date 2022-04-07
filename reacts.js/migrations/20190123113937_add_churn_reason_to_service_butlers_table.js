
exports.up = function(knex, Promise) {
  return knex.schema.table('serviceButlers', function (table) {
    table.string('churnReason');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('serviceButlers', function (table) {
    table.dropColumn('churnReason');
  });
};
