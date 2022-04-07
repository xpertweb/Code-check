exports.up = function(knex, Promise) {
    return knex.schema.table('serviceReschedule', table => {
      table.string('lastModifiedBy');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('serviceReschedule', table => {
      table.dropColumn('lastModifiedBy');
    })
  };
