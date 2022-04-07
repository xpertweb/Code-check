
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerAddresses', table => {
    table.inherits('addresses');

    table.primary('id');

    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');
    table.date('activeFrom').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlerAddresses');
};
