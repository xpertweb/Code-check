exports.up = function(knex, Promise) {
    return knex.schema.table('serviceExcludedButlers', table => {
      table.string('lastModifiedBy');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('serviceExcludedButlers', table => {
      table.dropColumn('lastModifiedBy');
    })
  };
