
exports.up = async function(knex, Promise) {
  await knex('butlerChurnCategories').insert([
    { reason: 'Not getting visits due to freeze or ratings' },
    { reason: 'Got another job' },
    { reason: 'Pay dispute' },
    { reason: 'Leaving country' },
    { reason: 'School or other personal circumstances' }
  ]);
  await knex.schema.table('butlerChurns', function(t) {
    t.string('unchurnAttempted').defaultTo('notattempted');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlerChurns', function(t) {
    t.dropColumn('unchurnAttempted');
  });
  await knex('butlerChurnCategories')
    .where('reason', 'Not getting visits due to freeze or ratings')
    .del();
  await knex('butlerChurnCategories')
    .where('reason', 'Got another job')
    .del();
  await knex('butlerChurnCategories')
    .where('reason', 'Pay dispute')
    .del();
  await knex('butlerChurnCategories')
    .where('reason', 'Leaving country')
    .del();
  await knex('butlerChurnCategories')
    .where('reason', 'School or other personal circumstances')
    .del();
};
