
exports.up = async function(knex, Promise) {
    return await knex.schema.table('butlers', function(t){
        t.boolean('steamCleanerProvided').defaultTo(false)
    })
  };
  
  exports.down = async function(knex, Promise) {
    return await knex.schema.table('butlers', function(t){
        t.dropColumn('steamCleanerProvided')
    })
  };
  