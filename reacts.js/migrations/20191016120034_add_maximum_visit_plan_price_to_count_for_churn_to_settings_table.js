
exports.up = async function(knex, Promise) {
  await knex.schema.table('churnPerClientSettings', function (table) {
    table.decimal('maximumVisitPlanPriceToCountTowardsCpc').defaultTo(35.00);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('churnPerClientSettings', function (table) {
    table.dropColumn('maximumVisitPlanPriceToCountTowardsCpc');
  });
};


