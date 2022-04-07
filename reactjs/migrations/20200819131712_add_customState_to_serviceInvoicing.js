exports.up = function(knex, Promise) {
  return knex.schema.table('serviceInvoicing', table => {
    table.string('customAddress').default('');
    table.integer('customPostcode').nullable();
    table.string('customState').default('');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('serviceInvoicing', table => {
    table.dropColumn('customAddress');
    table.dropColumn('customPostcode');
    table.dropColumn('customState');
  })
};
