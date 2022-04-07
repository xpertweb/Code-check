
exports.up = async function(knex, Promise) {
  return await knex.schema.createTableIfNotExists('secondaryChurnCategories', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.string('reason');
  })
    .then(() => {
      return knex('secondaryChurnCategories').insert([
        { reason: 'No secondary reason' },
        { reason: 'Change in circumstances' },
        { reason: 'Change in long-term butler' },
        { reason: 'Indefinite pause' },
        { reason: 'Quality' },
        { reason: 'Butler no-show' },
        { reason: 'Poor operator communication' },
        { reason: 'Operator error' },
        { reason: 'Unable to allocate visit'},
        { reason: 'No reason specified' },
        { reason: 'Butler error' },
        { reason: 'High butler turnover'},
        { reason: 'Other (specify below)' }
      ]);
    });
};

exports.down = async function(knex, Promise) {
  return await knex.schema.dropTableIfExists('secondaryChurnCategories');
};
