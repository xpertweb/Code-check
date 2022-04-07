
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('userIdentities', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('userIdentities');
};
