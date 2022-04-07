
exports.up = async function(knex) {
  await knex.schema.table('serviceInvoicing', function (table) {
    table.enu('paymentMethod', ['directDebit', 'bankTransfer']).defaultTo('directDebit');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('serviceInvoicing', function (table) {
    table.dropColumn('paymentMethod');
  });
};
