
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('feedback', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.decimal('score').notNullable();
    table.date('visitDate').notNullable();
    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('feedback');
};
