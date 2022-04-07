exports.up = async function(knex) {
  await knex.schema.table('serviceInvoicing', function (table) {
    table.string('recipientNumber');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('serviceInvoicing', function (table) {
    table.dropColumn('recipientNumber');
  });
};



