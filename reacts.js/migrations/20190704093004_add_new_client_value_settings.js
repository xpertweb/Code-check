
exports.up = async function (knex, Promise) {
  await knex.schema.table('clientValueSettings', function (table) {
    table.decimal('spraysWipesAndBasicsAddedPoints').defaultTo(100);
    table.decimal('vacuumAndMopAddedPoints').defaultTo(100);
  });

  await knex('clientValueSettings').update(
    {
      spraysWipesAndBasicsAddedPoints: 100,
      vacuumAndMopAddedPoints: 100
    });
};

exports.down = async function (knex, Promise) {
  await knex.schema.table('clientValueSettings', function (table) {
    table.dropColumn('spraysWipesAndBasicsAddedPoints');
    table.dropColumn('vacuumAndMopAddedPoints');
  });
};
