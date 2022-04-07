exports.up = function(knex) {
  return knex.schema.table('clients', function (table) {
    table.boolean('isConcierge').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('clients', function (table) {
    table.dropColumn('isConcierge');
  });
};
