exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('clientValueSettings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.decimal('futureWeeklyVisitPlansMultiplier');
    table.decimal('futureFortnightlyVisitPlansMultiplier');
    table.decimal('futureOnceOffVisitPlansMultiplier');
    table.decimal('daysOfClientLoyaltyMultiplier');
  });

  await knex('clientValueSettings').insert([
    {
      futureWeeklyVisitPlansMultiplier: 4,
      futureFortnightlyVisitPlansMultiplier: 3,
      futureOnceOffVisitPlansMultiplier: 2,
      daysOfClientLoyaltyMultiplier: 1.5
    }
  ]);
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('clientValueSettings');
};


