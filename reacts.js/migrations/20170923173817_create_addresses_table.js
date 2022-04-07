
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('addresses', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.string('line1').notNullable();
    table.string('line2').nullable();
    table.string('locale', 100).notNullable();
    table.string('state', 100).notNullable();
    table.string('postcode', 10).notNullable();
    table.string('country', 100).notNullable();
    table.specificType('geopoint', 'point').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('addresses');
};
