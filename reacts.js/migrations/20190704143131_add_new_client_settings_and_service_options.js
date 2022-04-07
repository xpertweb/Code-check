
exports.up = async function (knex, Promise) {
  await knex.schema.table('services', function (table) {
    table.boolean('isThirdPartyJob').defaultTo(false);
  });

  await knex.schema.table('clientValueSettings', function (table) {
    table.decimal('thirdPartyJobReducedPoints').defaultTo(10);
  });

  await knex('clientValueSettings').update(
    {
      thirdPartyJobReducedPoints: 10
    });
};

exports.down = async function (knex, Promise) {
  await knex.schema.table('services', function (table) {
    table.dropColumn('isThirdPartyJob');
  });

  await knex.schema.table('clientValueSettings', function (table) {
    table.dropColumn('thirdPartyJobReducedPoints');
  });
};
