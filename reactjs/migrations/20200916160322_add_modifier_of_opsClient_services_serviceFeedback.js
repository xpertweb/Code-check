exports.up = function(knex, Promise) {
    return knex.schema.table('serviceFeedback', table => {
      table.string('lastModifiedBy');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('serviceFeedback', table => {
      table.dropColumn('lastModifiedBy');
    })
  };

