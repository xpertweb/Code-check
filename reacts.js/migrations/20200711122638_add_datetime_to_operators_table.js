
exports.up = function (knex, Promise) {
  return knex.schema.table('operators', function (table) {
    table.datetime('dateTimeCreated');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('operators', function (table) {
    table.dropColumn('dateTimeCreated');
  });
};
