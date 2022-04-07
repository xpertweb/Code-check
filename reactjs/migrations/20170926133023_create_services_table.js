
exports.up = function(knex, Promise) 
{
  return knex.schema.createTableIfNotExists('services', table => 
  {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('clientId').notNullable();
    table.foreign('clientId').references('clients.id');
    table.enu('genderPref', ['m', 'f', 'n']).notNullable();
    table.boolean('pets').notNullable();
    table.boolean('errands').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('services');
};
