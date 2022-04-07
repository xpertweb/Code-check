
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('serviceButlers', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');
    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');
    table.date('activeFrom').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('serviceButlers');
};
