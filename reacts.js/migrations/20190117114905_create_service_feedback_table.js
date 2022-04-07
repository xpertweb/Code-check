
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('serviceFeedback', table => {
    table.inherits('feedback');

    table.primary('id');

    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');
    table.date('creationDate').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('serviceFeedback');
};
