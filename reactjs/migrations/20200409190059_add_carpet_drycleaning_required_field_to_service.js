exports.up = async function(knex, Promise) {
    return await knex.schema.table('services', function(t){
        t.boolean('carpetDryCleaningRequired').defaultTo(false)
    })
  };
  
  exports.down = async function(knex, Promise) {
    return await knex.schema.table('services', function(t){
        t.dropColumn('carpetDryCleaningRequired')
    })
  };
  