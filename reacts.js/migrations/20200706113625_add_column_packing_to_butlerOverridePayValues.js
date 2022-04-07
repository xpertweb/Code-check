
exports.up = function(knex, Promise) 
{
   return knex.schema.alterTable('butlerOverridePaySettings', function(t) 
   {
     t.float('packingService').defaultTo(100);
   });
};

exports.down = function(knex, Promise) 
{
  return knex.schema.alterTable('butlerOverridePaySettings', function(t) 
  {
     t.dropColumn('packingService');
  });
};
