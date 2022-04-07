
exports.up = function(knex, Promise) {
  return knex.schema.table('feedbackSettings', function (table) {
    table.decimal('penalizeRepeatedBadRatingCoefficient').default('0.1');
    table.decimal('penalizeRepeatedBadRatingThreshold').default(2);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('butlers', function (table) {
    table.dropColumn('penalizeRepeatedBadRatingCoefficient');
    table.dropColumn('penalizeRepeatedBadRatingThreshold');
  });
};
