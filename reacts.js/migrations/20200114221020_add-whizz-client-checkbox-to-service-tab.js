exports.up = async function(knex, Promise) {
  return await knex.schema.table('services', function(t) {
    t.boolean('isWhizzClient');
  });
};

exports.down = async function(knex, Promise) {
  return await knex.schema.table('services', function(t) {
    t.dropColumn('isWhizzClient');
  });
};
