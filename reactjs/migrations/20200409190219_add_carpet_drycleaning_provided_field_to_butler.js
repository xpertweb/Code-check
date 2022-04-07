exports.up = async function(knex, Promise) {
    return await knex.schema.table('butlers', function(t){
        t.boolean('carpetDryCleaningProvided').defaultTo(false)
    })
  };
  
  exports.down = async function(knex, Promise) {
    return await knex.schema.table('butlers', function(t){
        t.dropColumn('carpetDryCleaningProvided')
    })
  };
  