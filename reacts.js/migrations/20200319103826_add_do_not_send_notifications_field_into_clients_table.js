
exports.up = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.boolean('doNotSendNotifications').defaultTo(false);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('doNotSendNotifications');
  });  
};
