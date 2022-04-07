exports.up = async function(knex, Promise) {
  await knex.schema.table('serviceReschedule', function(t) {
    t.string('state').notNullable();
    t.boolean('mopRequired');
    t.boolean('vacuumRequired');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('serviceReschedule', function(t) {
    t.dropColumn('state');
    t.dropColumn('mopRequired');
    t.dropColumn('vacuumRequired');
  });
};
