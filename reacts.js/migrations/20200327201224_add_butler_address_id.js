
exports.up = function(knex, Promise) {
  return knex.schema.table('butlerEquipmentRequests', table => {
    table.string('butlerAddressId').nullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('butlerEquipmentRequests', table => {
    table.dropColumn('butlerAddressId')
  })
}
