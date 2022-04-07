exports.up = async function(knex) {
  await knex.schema.table('butlers', function(t) {
    t.string('freezeReason');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('butlers', function(t) {
    t.dropColumn('freezeReason');
  });
};
