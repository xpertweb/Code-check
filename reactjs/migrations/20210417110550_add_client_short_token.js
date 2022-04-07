
exports.up = function(knex, Promise) {
    return knex.schema.table('clients', function (table) {
      table.string('resetShortToken');
    });
  };
  
exports.down = function(knex, Promise) {
  return knex.schema.table('clients', function (table) {
    table.dropColumn('resetShortToken');
  });
};
