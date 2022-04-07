
exports.up = function(knex, Promise) 
{
   return knex.schema.alterTable('services', function(t) 
   {
     t.integer('numberOfBeds').defaultTo(0);
     t.integer('numberOfBathrooms').defaultTo(0);
   });
};

exports.down = function(knex, Promise) 
{
  return knex.schema.alterTable('services', function(t) 
  {
     t.dropColumn('numberOfBeds');
     t.dropColumn('numberOfBathrooms');
  });
};
