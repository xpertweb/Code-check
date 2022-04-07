exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('operatorsToDoItems', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('operatorId').notNullable();
    table.string('description').notNullable();
    table.time('taskTime').notNullable();
    table.string('taskTimezone').notNullable();
    table.string('lastModifiedBy').notNullable();
    table.datetime('createdDateTime').notNullable();
    table.foreign('operatorId').references('operators.id');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('operatorsToDoItems');
};
