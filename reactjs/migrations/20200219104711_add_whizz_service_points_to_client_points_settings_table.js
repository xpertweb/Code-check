
exports.up = async function (knex, Promise) {

  await knex.schema.table('clientValueSettings', function (table) {
    table.decimal('whizzServicesPoints').defaultTo(10);
  });

  await knex('clientValueSettings').update({
      whizzServicesPoints: 10
  });
};

exports.down = async function (knex, Promise) {

  await knex.schema.table('clientValueSettings', function (table) {
    table.dropColumn('whizzServicesPoints');
  });
};


