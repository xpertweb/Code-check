exports.up = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.decimal('clientLifetimeValue', 13, 2)
      .notNullable()
      .defaultsTo(0);
  });
};

exports.down = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.dropColumn('clientLifetimeValue');
  });
};
