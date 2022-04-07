
exports.up = async function (knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('equipments');
  });
  await knex.schema.table('services', function (table) {
    table.dropColumn('equipments');
  });

  await knex.schema.table('butlers', function (table) {
    table.boolean('equipments').defaultTo(false);
  });
  await knex.schema.table('services', function (table) {
    table.boolean('equipments').defaultTo(false);
  });

};

exports.down = async function (knex, Promise) {
  
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('equipments');
  });
  await knex.schema.table('services', function (table) {
    table.dropColumn('equipments');
  });
  
  await knex.schema.table('services', function (table) {
    table.boolean('equipments').notNullable().defaultTo(false);
  });

  await knex.schema.table('butlers', function (table) {
    table.boolean('equipments').notNullable().defaultTo(false);
  });
};
