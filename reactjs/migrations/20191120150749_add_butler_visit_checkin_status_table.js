
exports.up = async function(knex, Promise) {
  const exists = await knex.schema.hasTable('butlerVisitCheckinStatus');

  if (exists) return;
  
  await knex.schema.createTable('butlerVisitCheckinStatus', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');

    table.uuid('visitPlanId').notNullable();
    table.foreign('visitPlanId').references('visitPlans.id');
    table.datetime('dateTimeCheckinCreated').notNullable();
    table.date('visitDate').notNullable();
    table.boolean('butlerConfirmsCanAttendVisit');
    table.boolean('butlerConfirmsCannotAttendVisit');
    table.string('comment');
    table.boolean('checkinConfirmedAfterHavingBeenCancelled');
    
    table.boolean('butlerScheduleWasModifiedAndNeedsToBeReconfirmed');
    
    
    table.boolean('checkinCancelledAfterHavingBeenConfirmed');
    //visits cannot be checked in twice for the same day
    table.unique(['visitPlanId', 'visitDate', 'butlerId']);
  });

  await knex.raw(`
    ALTER TABLE public."butlerVisitCheckinStatus" DROP CONSTRAINT butlerVisitCheckinStatus_visitplanid_foreign,
    add constraint butlerVisitCheckinStatus_visitplanid_foreign
     foreign key ("visitPlanId")
     references public."visitPlans"(id)
     on delete cascade;
     `);
  
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists('butlerVisitCheckinStatus');

  await knex.raw(`ALTER TABLE public."butlerVisitCheckinStatus" DROP CONSTRAINT butlerVisitCheckinStatus_visitplanid_foreign,
    add constraint butlerVisitCheckinStatus_visitplanid_foreign
     foreign key ("visitPlanId")
     references public."visitPlans"(id);
      `);


};



