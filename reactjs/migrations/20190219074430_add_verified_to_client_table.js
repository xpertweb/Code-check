exports.up = async function(knex) {
  await knex.schema.table('clients', function(t) {
    t.boolean('verified').defaultTo(false);
  });

  await knex('clients').update( 'verified', true);
};

exports.down = async function(knex) {
  await knex.schema.table('clients', function(t) {
    t.dropColumn('verified');
  });

};
