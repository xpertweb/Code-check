exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('serviceButlerNoShow', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.date('date').notNullable();
    table.string('reason').notNullable();
    table.string('otherReason');
    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');
    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('serviceButlerNoShow');
};
