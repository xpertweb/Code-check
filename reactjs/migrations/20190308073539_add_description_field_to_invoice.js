exports.up = async function(knex) {
  await knex.schema.table('serviceInvoicing', function (table) {
    table.string('description');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('serviceInvoicing', function (table) {
    table.dropColumn('description');
  });
};
