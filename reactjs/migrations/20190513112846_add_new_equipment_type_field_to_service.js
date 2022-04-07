
exports.up = async function(knex) {
  await knex.schema.table('services', function (table) {
    table.boolean('spraysWipesAndBasicsRequired').defaultTo(false);
    table.boolean('vacuumAndMopRequired').defaultTo(false);

  });

  await knex.schema.table('butlers', function (table) {
    table.boolean('spraysWipesAndBasicsProvided').defaultTo(false);
    table.boolean('vacuumAndMopProvided').defaultTo(false);
  });

  await knex('services').update( 'spraysWipesAndBasicsRequired', true).where('equipments',true);
  await knex('butlers').update( 'spraysWipesAndBasicsProvided', true).where('equipments',true);

  await knex.schema.table('services', function (table) {
    table.dropColumn('equipments'); //it is no longer needed 
  });

  await knex.schema.table('butlers', function (table) {
    table.dropColumn('equipments'); //it is no longer needed 
  });
  
};

exports.down = async function(knex) {

  await knex.schema.table('services', function (table) {
    table.boolean('equipments').defaultTo(false);
  });
  
  await knex.schema.table('butlers', function (table) {
    table.boolean('equipments').defaultTo(false);
  });

  await knex('services').update( 'equipments', true).where('spraysWipesAndBasicsRequired',true);
  await knex('butlers').update( 'equipments', true).where('spraysWipesAndBasicsProvided',true);

  await knex.schema.table('services', function (table) {
    table.dropColumn('spraysWipesAndBasicsRequired');
    table.dropColumn('vacuumAndMopRequired');
  });
  
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('spraysWipesAndBasicsProvided');
    table.dropColumn('vacuumAndMopProvided');
  });


};
