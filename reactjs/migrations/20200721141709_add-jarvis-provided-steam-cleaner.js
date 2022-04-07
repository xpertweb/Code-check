
exports.up = function(knex) {
  return knex.schema.table('butlers', function(t){
    t.boolean('jarvisProvidedSteamCleaner').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('butlers', function(t){
    t.dropColumn('jarvisProvidedSteamCleaner');
  });
};
