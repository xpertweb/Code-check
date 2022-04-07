exports.up = async function(knex) {
  await knex.schema.createTable('serviceTasks', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('serviceId').notNullable();
    t.foreign('serviceId').references('services.id');
    t.uuid('taskId').notNullable();
    t.foreign('taskId').references('tasks.id');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('serviceTasks');
};
