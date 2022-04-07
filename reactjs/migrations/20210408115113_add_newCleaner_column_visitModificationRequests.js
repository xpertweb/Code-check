
exports.up = function(knex, Promise) {
  return knex.schema.table('visitModificationRequests', function (table) {
    table.boolean('newButlerNeeded').default(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('visitModificationRequests', function (table) {
    table.dropColumn('newButlerNeeded');
  });
};
