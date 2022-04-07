exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('feedbackSettings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.decimal('premiumThresholdRating').defaultTo(3);
    table.decimal('penaltyThresholdRating').defaultTo(2);
    table.decimal('premiumRating').defaultTo(0.1);
    table.decimal('negativeRating').defaultTo(2);
  });

  await knex('feedbackSettings').insert([
    {
      premiumThresholdRating: 3,
      penaltyThresholdRating: 2,
      premiumRating: 0.1,
      negativeRating: 2
    }
  ]);
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('feedbackSettings');
};
