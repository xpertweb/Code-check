exports.up = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.boolean('isOneOff').defaultTo(false);
  });
};

exports.down = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.dropColumn('isOneOff');
  });
};
