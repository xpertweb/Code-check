exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('serviceChurns', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('serviceId').notNullable();
    table.unique('serviceId');
    table.foreign('serviceId').references('services.id');
    table.uuid('reasonId');
    table.foreign('reasonId').references('churnCategories.id');
    table.date('creationDate');
    table.string('comment');
    table.date('getBackInTouchDate');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('serviceChurns');
};
