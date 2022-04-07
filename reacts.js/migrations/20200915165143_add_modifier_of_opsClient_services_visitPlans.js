exports.up = function(knex, Promise) {
    return knex.schema.table('visitPlans', table => {
      table.string('lastModifiedBy');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('visitPlans', table => {
      table.dropColumn('lastModifiedBy');
    })
  };
