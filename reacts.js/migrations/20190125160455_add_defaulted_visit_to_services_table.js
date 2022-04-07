exports.up = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.boolean('defaultedVisit').defaultTo(false);
  });
};

exports.down = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.dropColumn('defaultedVisit');
  });
};
