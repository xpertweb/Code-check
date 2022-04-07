exports.up = async function (knex) {
  await knex.raw(`
  ALTER TABLE public."requestedVisits" DROP CONSTRAINT requestedvisits_visitplanid_foreign,
  add constraint requestedvisits_visitplanid_foreign
   foreign key ("visitPlanId")
   references public."visitPlans"(id)
   on delete cascade;
   `);
};

exports.down = async function (knex) {
  await knex.raw(`ALTER TABLE public."requestedVisits" DROP CONSTRAINT requestedvisits_visitplanid_foreign,
  add constraint requestedvisits_visitplanid_foreign
   foreign key ("visitPlanId")
   references public."visitPlans"(id);
    `);
};
