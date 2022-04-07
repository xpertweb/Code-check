
exports.up = async function(knex, Promise) {
  await knex.raw('ALTER TABLE "secondaryChurnCategories" RENAME TO "newChurnCategories"');
  await knex('newChurnCategories').insert([
    { reason: 'We churn client' }
  ]);
  await knex.schema.table('serviceChurns', function(table) {
    table.uuid('primaryReasonId');
    table.foreign('primaryReasonId').references('newChurnCategories.id');
    table.dropForeign('secondaryreasonid'); 
    table.foreign('secondaryReasonId').references('newChurnCategories.id');
  });
  await knex('newChurnCategories')
    .where('reason', 'No secondary reason')
    .update('reason', 'None');
};

exports.down = async function(knex, Promise) {
  await knex('newChurnCategories')
    .where('reason', 'We churn client')
    .del();
  await knex.raw('ALTER TABLE "newChurnCategories" RENAME TO "secondaryChurnCategories"');
  await knex.schema.table('serviceChurns', function(table) {
    table.dropColumn('primaryReasonId');
    table.dropForeign('secondaryreasonid');
    table.foreign('secondaryReasonId').references('secondaryChurnCategories.id');
  });
  await knex('secondaryChurnCategories')
    .where('reason', 'None')
    .update('reason', 'No secondary reason');
};
