exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('clientToDoItems', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.string('summary');
    table.uuid('clientId');
    table.foreign('clientId').references('clients.id');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('clientToDoItems');
};