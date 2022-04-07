exports.up = function(knex, Promise) {
    return knex.schema.table('serviceChurns', table => {
      table.string('lastModifiedBy');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('serviceChurns', table => {
      table.dropColumn('lastModifiedBy');
    })
  };
