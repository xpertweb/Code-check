
exports.up = function (knex, Promise) {
  return knex.schema.table('serviceAddresses', function (table) {
    table.datetime('dateTimeCreated');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('serviceAddresses', function (table) {
    table.dropColumn('dateTimeCreated');
  });
};
