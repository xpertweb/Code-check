
exports.up = async function(knex, Promise) {
  await knex.raw(`ALTER TABLE "public"."serviceChurnRisks"
  ALTER COLUMN "note" TYPE VARCHAR(1000);`);
};

exports.down = async function(knex, Promise) {
  await knex.raw(`ALTER TABLE "public"."serviceChurnRisks"
  ALTER COLUMN "note" TYPE VARCHAR(255);`);
};
