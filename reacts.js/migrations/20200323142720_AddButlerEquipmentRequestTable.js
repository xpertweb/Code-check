
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerEquipmentRequests', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('butlerId').notNullable()
    table.foreign('butlerId').references('butlers.id')
    table.integer('maskQuantity')
    table.integer('gloveQuantity')
    table.integer('disinfectantQuantity')
    table.string('status')  // new / resolved / rejected
    table.string('type')    // bought / request
    table.string('receipt')
    table.date('requestStatusChangedDate')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlerEquipmentRequests');
};
