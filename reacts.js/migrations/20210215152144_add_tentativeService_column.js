exports.up = async function(knex, Promise) {
  return await knex.schema.table('butlerOverridePaySettings', function(t){
    t.float('tentativeServiceOverridePayExtraAddition').defaultTo(0);
  })
};

exports.down = async function(knex, Promise) {
  return await knex.schema.table('butlerOverridePaySettings', function(t){
    t.dropColumn('tentativeServiceOverridePayExtraAddition')
  })
};

