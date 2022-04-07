
exports.up = function(knex, Promise) {
  return knex.schema.table('serviceButlers', function (table) {
    table.decimal('hourlyPayOverride', 12, 2);
    table.string('comment');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('serviceButlers', function (table) {
    table.dropColumn('hourlyPayOverride');
    table.dropColumn('comment');
  });
};
