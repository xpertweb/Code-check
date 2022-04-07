
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('serviceAddresses', table => {
    table.inherits('addresses');

    table.primary('id');

    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');
    table.date('activeFrom').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('serviceAddresses');
};
