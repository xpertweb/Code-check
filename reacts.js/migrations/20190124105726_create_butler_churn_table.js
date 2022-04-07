exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerChurns', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('butlerId').notNullable();
    table.unique('butlerId');
    table.foreign('butlerId').references('butlers.id');

    table.uuid('reasonId');
    table.foreign('reasonId').references('butlerChurnCategories.id');
    table.date('churnDate');
    table.string('comment');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlerChurns');
};
