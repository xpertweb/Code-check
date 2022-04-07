
exports.up = async function(knex, Promise) {
  await knex.raw(`update "public"."newChurnCategories" set reason = 'Client is moving address' where reason = 'None'`);
};

exports.down = async function(knex, Promise) {
  await knex.raw(`update "public"."newChurnCategories" set reason = 'Client is moving address' where reason = 'None'`);
};
