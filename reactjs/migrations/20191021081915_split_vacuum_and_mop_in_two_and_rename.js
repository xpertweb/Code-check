
exports.up = async function(knex) {
  //service section
  await knex.schema.table('services', function(t) {
    t.boolean('vacuumRequired').defaultTo(false);
    t.boolean('mopRequired').defaultTo(false);
  });

  await knex('services').update( 'vacuumRequired', true).where('vacuumAndMopRequired',true);
  await knex('services').update( 'mopRequired', true).where('vacuumAndMopRequired',true);

  await knex.schema.table('services', function(t) {
    t.dropColumn('vacuumAndMopRequired');
  });
  //butler section
  await knex.schema.table('butlers', function(t) {
    t.boolean('vacuumProvided').defaultTo(false);
    t.boolean('mopProvided').defaultTo(false);

  });

  await knex('butlers').update( 'vacuumProvided', true).where('vacuumAndMopProvided',true);
  await knex('butlers').update( 'mopProvided', true).where('vacuumAndMopProvided',true);

  await knex.schema.table('butlers', function(t) {
    t.dropColumn('vacuumAndMopProvided');
  });
};

exports.down = async function(knex) {
await knex.schema.table('services', function(t) {
  t.dropColumn('mopProvided');
  t.dropColumn('vacuumProvided');
});

await knex.schema.table('butlers', function(t) {
  t.dropColumn('mopProvided');
  t.dropColumn('vacuumProvided');
});
};


