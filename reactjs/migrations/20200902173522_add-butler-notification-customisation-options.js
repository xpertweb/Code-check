exports.up = function(knex, Promise) {
    return knex.schema.table('butlers', table => {
        table.boolean('doNotSendAllocationsNotifications').defaultTo(false);
        table.boolean('doNotSendNotifications').defaultTo(false);
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('butlers', table => {
      table.dropColumn('doNotSendAllocationsNotifications');
      table.dropColumn('doNotSendNotifications');
    })
  };
  