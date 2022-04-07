
exports.up = function (knex, Promise) {
  return knex.schema.table('serviceExpenses', function (table) {
    table.datetime('dateTimeCreated');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('serviceExpenses', function (table) {
    table.dropColumn('dateTimeCreated');
  });
};
