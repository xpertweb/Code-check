
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('visitPlans', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');

    table.specificType('dateRange', 'daterange').notNullable();
    table.specificType('timeWindow', 'timerange').notNullable();
    table.specificType('duration', 'interval').notNullable();
    table.enu('recurrance', ['n', 'w', 'f']).notNullable();
    table.decimal('hourlyRateOverride', 12, 2).nullable();
  }).raw(`
    ALTER TABLE "visitPlans"
    	ADD CONSTRAINT "nonEmptyDateRange" CHECK ("dateRange" <> \'empty\');
  	ALTER TABLE "visitPlans"
    	ADD CONSTRAINT "nonEmptyTimeWindow" CHECK ("timeWindow" <> \'empty\');
    ALTER TABLE "visitPlans"
    	ADD CONSTRAINT "nonZeroDuration" CHECK ("duration" <> \'0\'::interval);
    ALTER TABLE "visitPlans"
    	ADD CONSTRAINT "timeWindowLargeEnough" CHECK ("duration" <= (upper("timeWindow") - lower("timeWindow")));
    `);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('visitPlans');
};
