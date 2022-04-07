
exports.up = function(knex, Promise) {
  return knex.schema.table('clients', function (table) {
    table.string('legacyUsername');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('clients', function (table) {
    table.dropColumn('legacyUsername');
  });
};
