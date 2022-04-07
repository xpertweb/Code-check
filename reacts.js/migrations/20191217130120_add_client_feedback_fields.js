
exports.up = async function(knex, Promise) {
  return await knex.schema.table('serviceFeedback', function(t) {
    t.boolean('butlerWasLate').defaultTo(false);
    t.boolean('butlerLeftEarly').defaultTo(false);
    t.boolean('butlerDidNotShowUp').defaultTo(false);
    t.string('feedbackAppealedStatus').defaultTo('none');
  });
};

exports.down = async function(knex, Promise) {
  return await knex.schema.table('serviceFeedback', function(t) {
    t.dropColumn('butlerWasLate');
    t.dropColumn('butlerLeftEarly');
    t.dropColumn('butlerDidNotShowUp');
    t.dropColumn('feedbackAppealedStatus');
  });
};
