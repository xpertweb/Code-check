
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('operators', table => {
    table.inherits('users');

    table.primary('id');
    table.foreign('id').references('userIdentities.id');
    table.unique('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('operators');
};
