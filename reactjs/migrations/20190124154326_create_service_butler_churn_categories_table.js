exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('serviceButlerChurnCategories', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.string('reason');
  }).then(() => {
    return knex('serviceButlerChurnCategories').insert([
      { reason: 'Butler dropped: Distance' },
      { reason: 'Butler dropped: Hygiene reason' },
      { reason: 'Butler dropped: Unhappy with client' },
      { reason: 'Butler dropped: Clashes with another client' },
      { reason: 'Butler dropped: Clashes with a non-Backend job' },
      { reason: 'Butler dropped: Other' },
      { reason: 'Butler dropped: Butler churned' },
      { reason: 'Client dropped: Unhappy with butler' }
    ]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('serviceButlerChurnCategories');
};
