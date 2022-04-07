exports.up = function(knex, Promise) {
  return knex.schema.alterTable('requestedVisits', function(t) {
    t.date('dateOfVisitRequested');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('requestedVisits', function(t) {
    t.date('dateOfVisitRequested');
  });
};
