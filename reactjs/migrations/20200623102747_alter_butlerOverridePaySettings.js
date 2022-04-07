
exports.up = function(knex, Promise) 
{
   return knex.schema.alterTable('butlerOverridePaySettings', function(t) 
   {
     t.float('spraysWipesAndBasics').defaultTo(100);
   });
};

exports.down = function(knex, Promise) 
{
  return knex.schema.alterTable('butlerOverridePaySettings', function(t) 
  {
     t.dropColumn('spraysWipesAndBasics');
  });
};
