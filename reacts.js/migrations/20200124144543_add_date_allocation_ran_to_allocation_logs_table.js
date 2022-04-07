exports.up = async function(knex, Promise) {
  return await knex.schema.table('allocationLogs', function(t) {
    t.datetime('dateTimeAllocationExecuted');
  });
};

exports.down = async function(knex, Promise) {
  return await knex.schema.table('allocationLogs', function(t) {
    t.dropColumn('dateTimeAllocationExecuted');
  });
};


