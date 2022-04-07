
exports.up = function (knex, Promise) {
  return knex.schema.table('servicePauses', function (table) {
    table.datetime('dateTimeCreated');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('servicePauses', function (table) {
    table.dropColumn('dateTimeCreated');
  });
};
