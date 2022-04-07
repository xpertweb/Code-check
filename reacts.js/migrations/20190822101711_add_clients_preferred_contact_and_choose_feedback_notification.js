
exports.up = async function(knex, Promise) {
  await knex('clients').update(
    {
      preferredContact: 'm',
    }
  ).where('preferredContact',null);

  await knex('butlers').update(
    {
      preferredContact: 'm',
    }
  ).where('preferredContact',null);

  await knex.schema.table('clients', function (table) {
    table.boolean('doNotSendFeedbackRequestNotifications').defaultTo(false);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('doNotSendFeedbackRequestNotifications');
  });
};

