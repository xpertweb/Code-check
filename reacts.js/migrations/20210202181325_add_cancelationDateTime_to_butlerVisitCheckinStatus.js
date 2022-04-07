exports.up = async function(knex, Promise) {
  return await knex.schema.table('butlerVisitCheckinStatus', function(t) {
    t.string('cancellationDateTime').defaultTo('N/A');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlerVisitCheckinStatus', function(t) {
    t.dropColumn('cancellationDateTime');
  });
};
