
exports.up = function(knex, Promise) 
{
   return knex.schema.alterTable('serviceButlerNoShow', function(t) 
   {
     t.string('operatorName',1000).nullable();
   });
};

exports.down = function(knex, Promise) 
{
  return knex.schema.alterTable('serviceButlerNoShow', function(t) 
  {
     t.dropColumn('operatorName');
  });
};
