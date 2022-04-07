
exports.up = function(knex, Promise) {
  return knex.schema.table('services', function (table) {
    table.text('notes');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('services', function (table) {
    table.dropColumn('notes');
  });
};
