
exports.up = function(knex, Promise) {
  return knex.schema.table('visitModificationRequests', function (table) {
    table.datetime('dateTimeCreated');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('visitModificationRequests', function (table) {
    table.datetime('dateTimeCreated');
  });
};
