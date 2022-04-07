
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('requestedVisits', function(t) {
    t.string('preferredVisitDate');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('requestedVisits', function(t) {
    t.string('preferredVisitDate');
  });
};
