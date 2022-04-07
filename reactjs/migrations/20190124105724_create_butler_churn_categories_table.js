exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerChurnCategories', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.string('reason');
  }).then(() => {
    return knex('butlerChurnCategories').insert([
      { reason: 'Study commitments' },
      { reason: 'Got another job' },
      { reason: 'Medical reason' },
      { reason: 'Leaving the country or state' },
      { reason: 'Unhappy with the number of jobs received' },
      { reason: 'Unhappy with pay' },
      { reason: 'Unhappy with cancellation fee' },
      { reason: 'Unhappy with terms (eg. insurance)' },
      { reason: 'Other' }
    ]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlerChurnCategories');
};
