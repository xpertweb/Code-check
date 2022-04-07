
exports.up = function(knex, Promise) 
{
   return knex.schema.alterTable('butlerOverridePaySettings', function(t) 
   {
     t.float('gardeningService').defaultTo(0);
   });
};

exports.down = function(knex, Promise) 
{
  return knex.schema.alterTable('butlerOverridePaySettings', function(t) 
  {
     t.dropColumn('gardeningService');
  });
};