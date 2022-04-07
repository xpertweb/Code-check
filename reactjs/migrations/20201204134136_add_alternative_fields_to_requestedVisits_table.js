
exports.up = function(knex, Promise) {
  return knex.schema.table('requestedVisits', function (table) {
    table.boolean('alternativeVisitPlanDateAndTimeSelected');
    table.string('alternativeVisitTime');
    table.string('alternativeStartDate');
    table.string('alternativeEndDate');
    table.string('visitPlanDate')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('requestedVisits', function (table) {
    table.dropColumn('alternativeVisitPlanDateAndTimeSelected');
    table.dropColumn('alternativeVisitTime');
    table.dropColumn('alternativeStartDate');
    table.dropColumn('alternativeEndDate');
    table.dropColumn('visitPlanDate');
  });
};
