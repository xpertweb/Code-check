exports.up = async function (knex) {
  await knex.schema.table('feedbackSettings', function (t) {
    t.decimal('butlerDefaultRatingToSet').defaultTo(5);
  }).raw(`
  UPDATE "public"."feedbackSettings"
  SET "butlerDefaultRatingToSet" = 5
  FROM (SELECT id FROM  "public"."feedbackSettings") AS subquery
  WHERE "public"."feedbackSettings"."id"=subquery.id;
    `);
};

exports.down = async function (knex) {
  await knex.schema.table('feedbackSettings', function (t) {
    t.dropColumn('butlerDefaultRatingToSet');
  });
};