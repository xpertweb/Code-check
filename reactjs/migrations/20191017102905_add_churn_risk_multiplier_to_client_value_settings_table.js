
exports.up = async function(knex, Promise) {
  await knex.schema.table('clientValueSettings', function (table) {
    table.decimal('churnRiskMultiplier').defaultTo(0.5);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('clientValueSettings', function (table) {
    table.dropColumn('churnRiskMultiplier');
  });
};




