
exports.up = function (knex, Promise) {
  return knex.schema.table('serviceExcludedButlers', function (table) {
    table.datetime('dateTimeCreated');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('serviceExcludedButlers', function (table) {
    table.dropColumn('dateTimeCreated');
  });
};
