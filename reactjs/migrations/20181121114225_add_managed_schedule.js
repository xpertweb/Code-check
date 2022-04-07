exports.up = async function(knex) {
  await knex.schema.table('butlers', function(t) {
    t.boolean('managedSchedule').defaultTo(false);
  });
};

exports.down = async function(knex) {
  await knex.schema.table('butlers', function(t) {
    t.dropColumn('managedSchedule');
  });
};
