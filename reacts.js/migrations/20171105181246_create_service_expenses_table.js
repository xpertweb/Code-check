
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('serviceExpenses', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');

    table.date('date').notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.string('summary').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('serviceExpenses');
};
