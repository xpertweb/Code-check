
exports.up = function (knex, Promise) {
  return knex.schema.table('serviceAddresses', function (table) {
    table.string('closestBusStop');
    table.string('closestTrainStation');
    table.string('closestTramStation');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('serviceAddresses', function (table) {
    table.dropColumn('closestBusStop');
    table.dropColumn('closestTrainStation');
    table.dropColumn('closestTramStation');
  });
};
