
exports.up = async function(knex, Promise) {
  await knex.raw(`update "public"."serviceAddresses" set state = 'WA' where state = 'PER'`);
  await knex.raw(`update "public"."butlerAddresses" set state = 'WA' where state = 'PER'`);
  
};

exports.down = async function(knex, Promise) {
  await knex.raw(`update "public"."serviceAddresses" set state = 'PER' where state = 'WA'`);
  await knex.raw(`update "public"."butlerAddresses" set state = 'PER' where state = 'WA'`);

};
