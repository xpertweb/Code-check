
exports.up = async function(knex, Promise) {
  await knex('butlerEquipmentRequests')
    .whereNull('butlerAddressId')
    .update('butlerAddressId', '');

  await knex('butlerEquipmentRequests')
    .where('butlerAddressId', '')
    .update('butlerAddressId', '00000000-0000-0000-0000-000000000000');
    
  await knex.schema.alterTable('butlerEquipmentRequests', function(t) {
    t.uuid('butlerAddressId').defaultTo(knex.raw('uuid_nil()')).alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('butlerEquipmentRequests', function(t) {
    t.string('butlerAddressId').nullable().alter();
  });
};
