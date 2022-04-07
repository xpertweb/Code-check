exports.up = async function(knex) {
  await knex.schema.table('serviceFeedback', function(t) {
    t.string('comment');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('serviceFeedback', function(t) {
    t.dropColumn('comment');
  });
};
