
exports.up = (knex, Promise) => {
  return knex.schema.table('butlerVisitCheckinStatus', (t) => {
    t.datetime('visitAssignedToButlerDateTime').nullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.table('butlerVisitCheckinStatus', (t) => {
    t.dropColumn('visitAssignedToButlerDateTime');
  });
};
