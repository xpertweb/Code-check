exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerStrikeCategories', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.string('reason');
  }).then(() => {
    return knex('butlerStrikeCategories').insert([
      { reason: 'Cancelling on client(s) at short notice' },
      { reason: 'Cancelling on a client before minimum no. of visits' },
      { reason: 'Running late and failing to let us know' },
      { reason: 'Running over two hours late without reason' },
      { reason: 'Taking a client off-platform' },
      { reason: 'Rescheduling the same client two or more times before a visit' },
      { reason: 'Failing to provide ABN' },
      { reason: 'Failing to promptly return a client key' },
      { reason: 'Failing to speak English at the required level' },
      { reason: 'Being rude to client' },
      { reason: 'Being rude to operations team' },
      { reason: 'Other' }
    ]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlerStrikeCategories');
};
