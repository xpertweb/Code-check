exports.up = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.decimal('clientRating')
      .notNullable()
      .defaultsTo(0);
  });
};

exports.down = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.dropColumn('clientRating');
  });
};
