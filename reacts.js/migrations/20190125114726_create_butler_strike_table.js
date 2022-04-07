exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerStrikes', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('butlerId').notNullable();
    table.unique('butlerId');
    table.foreign('butlerId').references('butlers.id');

    table.uuid('reasonId');
    table.foreign('reasonId').references('butlerStrikeCategories.id');
    table.date('strikeDate');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('butlerStrikes');
};
