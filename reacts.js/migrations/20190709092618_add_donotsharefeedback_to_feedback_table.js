
exports.up = async function(knex, Promise) {
  await knex.schema.table('serviceFeedback', function (table) {
    table.boolean('doNotShareFeedbackWithButler').defaultTo(false);
  });
  await knex('serviceFeedback').update(
    {
      doNotShareFeedbackWithButler: true
    });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('serviceFeedback', function (table) {
    table.dropColumn('doNotShareFeedbackWithButler');
  });
};
