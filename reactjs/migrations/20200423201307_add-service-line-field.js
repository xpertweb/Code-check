exports.up = function(knex, Promise) {
  return knex.schema.table('services', table => {
    table.string('serviceLine').default('cleaning');
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('services', table => {
    table.dropColumn('serviceLine');
  })
}