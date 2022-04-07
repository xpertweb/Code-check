exports.up = async function(knex, Promise) {
  return await knex.schema.table('butlers', function(t) {
    t.boolean('vacuumSuppliedByJarvis').defaultTo(false);
    t.boolean('vacuumReturnedToJarvis').defaultTo(false);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlers', function(t) {
    t.dropColumn('vacuumSuppliedByJarvis');
    t.dropColumn('vacuumReturnedToJarvis');
  });
};
