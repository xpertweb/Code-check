
exports.up = async function(knex, Promise) {
  await knex.raw(`ALTER TABLE "public"."serviceChurns"
  ALTER COLUMN "comment" TYPE VARCHAR(1000);`);
};

exports.down = async function(knex, Promise) {
  await knex.raw(`ALTER TABLE "public"."serviceChurns"
  ALTER COLUMN "comment" TYPE VARCHAR(255);`);
};
