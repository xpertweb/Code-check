
exports.up = function(knex, Promise) 
{
  return knex.schema.createTableIfNotExists('butlerOverridePaySettings', table => 
  {
    table.increments('id').primary();
    table.float('pet').notNullable();
    table.float('errands').notNullable();
    table.float('vaccum').notNullable();
    table.float('mop').notNullable();
    table.float('disinfectant').notNullable();
    table.float('steamCleaner').notNullable();
    table.float('carpetDryCleaning').notNullable();
    table.float('endOfLease').notNullable();
    table.float('furnitureAssembly').notNullable();
  });
};

exports.down = function(knex, Promise) 
{
  return knex.schema.dropTableIfExists('butlerOverridePaySettings');
};
