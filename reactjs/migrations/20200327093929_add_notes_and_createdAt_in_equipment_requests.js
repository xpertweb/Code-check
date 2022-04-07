
exports.up = function(knex, Promise) {
  return knex.schema.table('butlerEquipmentRequests', table => {
    table.text('note')
    table.datetime('createdAt').notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('butlerEquipmentRequests', function (table) {
    table.dropColumn('note')
    table.dropColumn('createdAt')
  })
}
