
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', table => {
    table.uuid('id').primary();

    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('firstName', 100).notNullable();
    table.string('lastName', 100).notNullable();
    table.string('phoneNumber', 15).notNullable();

    table.string('facebookId').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
