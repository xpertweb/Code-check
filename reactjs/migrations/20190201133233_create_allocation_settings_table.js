exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('allocationSettings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.integer('daysFromNowToTakeOnlyRequestedVisits').defaultTo(1);
    table.decimal('disqualifyingButlerRating').defaultTo(3.5);
    table.integer('disqualifyingNumberOfVisits').defaultTo(3);
    table.integer('maxAllocationsForButlerPerRun').defaultTo(1);
    table.decimal('premiumRatingPointsForRequestedVisitButlers').defaultTo(0.1);
    table.decimal('premiumRatingPointsForFemaleButlers').defaultTo(0.1);

  });

  await knex('allocationSettings').insert([
    {
      daysFromNowToTakeOnlyRequestedVisits: 1,
      disqualifyingButlerRating: 3.5,
      disqualifyingNumberOfVisits: 3,
      maxAllocationsForButlerPerRun: 1,
      premiumRatingPointsForRequestedVisitButlers: 0.1,
      premiumRatingPointsForFemaleButlers: 0.1
    }
  ]);
};


exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('allocationSettings');
};
