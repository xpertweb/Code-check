exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('allocationLogs', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.json('allocatedButlersJsonData');
    table.date('executionDate').notNullable();
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('allocationLogs');
};
