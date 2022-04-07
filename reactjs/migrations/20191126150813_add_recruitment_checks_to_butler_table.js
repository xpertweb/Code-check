
exports.up = async function(knex, Promise) {
  return await knex.schema.table('butlers', function (table) {
    table.string('referenceCheck').defaultTo('incomplete');
    table.string('englishCheck').defaultTo('incomplete');
    table.string('onboardedOntoPlatform').defaultTo('incomplete');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('referenceCheck');
    table.dropColumn('englishCheck');
    table.dropColumn('onboardedOntoPlatform');
  });
};
