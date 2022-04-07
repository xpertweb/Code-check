
exports.up = async function(knex, Promise) {
  await knex.schema.table('requestedVisits', function (table) {
    table.string('periodWillingToCommit');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('requestedVisits', function (table) {
    table.dropColumn('periodWillingToCommit');
  });
};


