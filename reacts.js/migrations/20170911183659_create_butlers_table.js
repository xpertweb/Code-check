
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlers', table => {
    table.inherits('users');

    table.primary('id');
    table.foreign('id').references('userIdentities.id');
    table.unique('email');

    table.enu('gender', ['m', 'f']).notNullable();
    table.decimal('rating').notNullable();
    table.boolean('onFreeze').notNullable();
    table.boolean('handlesPets').notNullable();
    table.boolean('hasCar').notNullable();
    table.decimal('maxTravelDistance').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlers');
};
