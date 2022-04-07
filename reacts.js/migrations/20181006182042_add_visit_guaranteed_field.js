exports.up = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.boolean('visitGuaranteed').defaultTo(false);
  });
};

exports.down = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.dropColumn('visitGuaranteed');
  });
};
