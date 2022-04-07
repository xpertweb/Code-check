exports.up = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
     table.string('salesForceLeadId').nullable();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('salesForceLeadId');
  });
};
