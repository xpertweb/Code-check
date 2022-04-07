exports.up = function(knex, Promise) {
  return knex.schema.table('butlerEquipmentRequests', table => {
    table.string('requestMadeBy').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('butlerEquipmentRequests', table => {
    table.dropColumn('requestMadeBy');
  });
};
