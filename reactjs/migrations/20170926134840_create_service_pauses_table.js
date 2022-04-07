
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('servicePauses', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');

    table.specificType('dateRange', 'daterange').notNullable();
  }).raw(`
    ALTER TABLE "servicePauses"
    	ADD CONSTRAINT "nonEmptyDateRange" CHECK ("dateRange" <> \'empty\');
    `);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('servicePauses');
};
