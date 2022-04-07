exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('churnPerClientSettings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.integer('daysOfTenureByButler').defaultTo(30);
    table.decimal('disqualifyingChurnPerClientRating').defaultTo(5);
  });

  await knex('churnPerClientSettings').insert([
    {
      daysOfTenureByButler: 30,
      disqualifyingChurnPerClientRating:0.6
    }
  ]);
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('churnPerClientSettings');
};
