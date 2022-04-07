exports.up = async function(knex) {
  await knex.schema.createTable('butlerSkills', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('butlerId').notNullable();
    t.foreign('butlerId').references('butlers.id');
    t.uuid('taskId').notNullable();
    t.foreign('taskId').references('tasks.id');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('butlerSkills');
};
