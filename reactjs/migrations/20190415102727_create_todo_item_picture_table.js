exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('clientToDoItemPictures', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.string('imageUrl');
    table.uuid('clientToDoItemId');
    table.foreign('clientToDoItemId').references('clientToDoItems.id');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('clientToDoItemPictures');
};