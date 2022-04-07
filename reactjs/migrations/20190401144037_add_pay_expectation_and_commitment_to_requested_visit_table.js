exports.up = async function (knex, Promise) {
  await knex.schema.table('requestedVisits', function (table) {
    table.decimal('payExpectedToBeReceivedFromVisit');
    table.date('dateWillingToCommitForThisVisit');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.table('requestedVisits', function (table) {
    table.dropColumn('payExpectedToBeReceivedFromVisit');
    table.dropColumn('dateWillingToCommitForThisVisit');
  });
};

