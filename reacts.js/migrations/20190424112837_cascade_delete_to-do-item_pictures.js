exports.up = async function (knex) {
  await knex.raw(`
  ALTER TABLE public."clientToDoItemPictures" DROP CONSTRAINT clientToDoItemPictures_clientToDoItemId_foreign,
  add constraint clientToDoItemPictures_clientToDoItemId_foreign
   foreign key ("clientToDoItemId")
   references public."clientToDoItems"(id)
   on delete cascade;
   `);
};

exports.down = async function (knex) {
  await knex.raw(`ALTER TABLE public."clientToDoItemPictures" DROP CONSTRAINT clientToDoItemPictures_clientToDoItemId_foreign,
  add constraint clientToDoItemPictures_clientToDoItemId_foreign
   foreign key ("clientToDoItemId")
   references public."clientToDoItems"(id);
    `);
};
