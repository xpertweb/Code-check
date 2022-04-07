
exports.up = function(knex, Promise) {
  return knex.schema.table('clients', function (table) {
    table.string('voucherCode');
    table.decimal('voucherHours', 12, 2);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('clients', function (table) {
    table.dropColumn('voucherCode');
    table.dropColumn('voucherHours');
  });
};
