exports.up = function(knex, Promise) {
  return knex.schema.table('visitPlans', function(table) {
    table.string('comment');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('visitPlans', function(table) {
    table.dropColumn('comment');
  });
};
