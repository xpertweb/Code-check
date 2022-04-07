
exports.up = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.boolean('doNotSendRemindersTwoDaysBefore').defaultTo(false);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('doNotSendRemindersTwoDaysBefore');
  });
};

