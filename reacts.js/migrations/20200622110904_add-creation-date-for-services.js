
exports.up = function(knex, Promise) {
  console.log('add: dateTimeCreated into services');
  return knex.schema.table('services', table => {
    table.datetime('dateTimeCreated');
  });
};

exports.down = function(knex, Promise) {
  console.log('drop: dateTimeCreated from services');
  return knex.schema.table('services', function (table) {
    table.dropColumn('dateTimeCreated');
  });
};
