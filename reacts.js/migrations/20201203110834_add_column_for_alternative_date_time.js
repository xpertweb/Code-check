
exports.up = function(knex, Promise) {
  return knex.schema.table('visitPlans', function (table) {
    table.string('alternativeStartDate');
    table.string('alternativeEndDate');
    table.string('alternativeWindowStartTime');
    table.string('alternativeWindowEndTime');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('visitPlans', function (table) {
    table.dropColumn('alternativeStartDate');
    table.dropColumn('alternativeEndDate');
    table.dropColumn('alternativeWindowStartTime');
    table.dropColumn('alternativeWindowEndTime');
  });
};
