
exports.up = function(knex, Promise) {
    return knex.schema.table('allocationSettings', function (table) {
        table.integer('minRequestsToAutoAllocateVisit').default(0);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('allocationSettings', function (table) {
        table.integer('minRequestsToAutoAllocateVisit').default(0);
      });
};
