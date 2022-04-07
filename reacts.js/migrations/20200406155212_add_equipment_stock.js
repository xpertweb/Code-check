
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerEquipmentStock', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');
    table.integer('mask');
    table.integer('glove');
    table.integer('disinfectant');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlerEquipmentStock');
};
