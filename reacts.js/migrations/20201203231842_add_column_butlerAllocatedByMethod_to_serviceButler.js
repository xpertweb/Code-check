
exports.up = async function(knex) {
  await knex.schema.table('serviceButlers', function (table) {
    table.enu('butlerAllocatedByMethod', ['manual', 'managedschedulesystem','butlerrequestedthisvisit']).defaultTo('manual');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('serviceButlers', function (table) {
    table.dropColumn('butlerAllocatedByMethod');
  });
};
