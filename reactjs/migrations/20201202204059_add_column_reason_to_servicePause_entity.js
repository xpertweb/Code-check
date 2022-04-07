
exports.up = function(knex, Promise) {
  return knex.schema.table('servicePauses', function (table) {
    table.string('reason',512);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('servicePauses', function (table) {
    table.dropColumn('reason');
  });
};
