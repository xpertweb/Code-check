exports.up = async function (knex) {
  await knex.raw(`
  ALTER TABLE public."visitModificationRequests" DROP CONSTRAINT visitmodificationrequests_visitplanid_foreign,
  add constraint visitmodificationrequests_visitplanid_foreign
   foreign key ("visitPlanId")
   references public."visitPlans"(id)
   on delete cascade;
   `);
};

exports.down = async function (knex) {
  await knex.raw(`ALTER TABLE public."visitModificationRequests" DROP CONSTRAINT visitmodificationrequests_visitplanid_foreign,
  add constraint visitmodificationrequests_visitplanid_foreign 
   foreign key ("visitPlanId")
   references public."visitPlans"(id);
    `);
};
