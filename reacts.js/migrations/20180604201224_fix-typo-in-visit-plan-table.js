exports.up = async function(knex) {
  await knex.schema.table('visitPlans', function(t) {
    t.renameColumn('recurrance', 'recurrence');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('visitPlans', function(t) {
    t.renameColumn('recurrence', 'recurrance');
  });
};
