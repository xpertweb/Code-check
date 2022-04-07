
exports.up = async function(knex, Promise) {
  return await knex.schema.table('services', function(t){
      t.boolean('disinfectantRequired').defaultTo(false)
  })
};

exports.down = async function(knex, Promise) {
  return await knex.schema.table('services', function(t){
      t.dropColumn('disinfectantRequired')
  })
};
