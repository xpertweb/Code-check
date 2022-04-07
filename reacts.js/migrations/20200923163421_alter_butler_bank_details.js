
exports.up = function (knex, Promise) {
  return knex.schema.table('butlerBankDetails', function (table) {
    table.datetime('lastModifiedDateTime');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('butlerBankDetails', function (table) {
    table.dropColumn('lastModifiedDateTime');
  });
};