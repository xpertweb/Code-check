exports.up = async function(knex, Promise) {
  return await knex.raw('ALTER TABLE "public"."butlers" ALTER COLUMN "freezeReason" TYPE text');
};

exports.down = async function(knex, Promise) {
  return await knex.raw('ALTER TABLE "public"."butlers" ALTER COLUMN "freezeReason" TYPE VARCHAR(255)');
};
