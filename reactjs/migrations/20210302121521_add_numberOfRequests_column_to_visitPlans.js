
exports.up = function(knex, Promise) {
  return knex.schema.table('visitPlans', function (table) {
    table.integer('numberOfRequests').default(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('visitPlans', function (table) {
    table.dropColumn('numberOfRequests');
  });
};
