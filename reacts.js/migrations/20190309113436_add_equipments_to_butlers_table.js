
exports.up = function(knex, Promise) {
    return knex.schema.table('butlers', function (table) {
        table.boolean('equipments').notNullable().defaultTo(false);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('butlers', function (table) {
        table.dropColumn('equipments');        
      });
};
