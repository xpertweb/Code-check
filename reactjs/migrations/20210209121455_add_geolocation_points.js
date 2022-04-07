
exports.up = function (knex, Promise) {
  return knex.schema.table('serviceAddresses', function (table) {
    table.string('closestGeoPoints');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('serviceAddresses', function (table) {
    table.dropColumn('closestGeoPoints');
  });
};
