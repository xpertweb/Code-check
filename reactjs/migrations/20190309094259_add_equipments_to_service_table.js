
exports.up = function(knex, Promise) {
    return knex.schema.table('services', function (table) {
        table.boolean('equipments').notNullable().defaultTo(false);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('services', function (table) {
        table.dropColumn('equipments');        
      });
};
