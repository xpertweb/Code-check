exports.up = function(knex, Promise) {
    return knex.schema.table('serviceButlers', table => {
      table.string('lastModifiedBy');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('serviceButlers', table => {
      table.dropColumn('lastModifiedBy');
    })
  };
