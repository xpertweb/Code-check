
exports.up = function (knex, Promise) {
  return knex.schema.table('services', function (table) {
    table.float('urgentExtraPayAmount').defaultTo(0);
    table.boolean('urgentExtraPayProvided').defaultTo(false);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('services', function (table) {
    table.dropColumn('urgentExtraPayAmount');
    table.dropColumn('urgentExtraPayProvided');
  });
};
