
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('workBlocks', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');

    table.specificType('dateRange', 'daterange').notNullable();
    table.specificType('timeWindow', 'timerange').notNullable();
  }).raw(`
  	ALTER TABLE "workBlocks"
    	ADD CONSTRAINT "nonEmptyDateRange" CHECK ("dateRange" <> \'empty\');
    ALTER TABLE "workBlocks"
      ADD CONSTRAINT "nonEmptyTimeWindow" CHECK ("timeWindow" <> \'empty\');
    ALTER TABLE "workBlocks"
      ADD CONSTRAINT "nonOverlappingDateRangesOnSameDay"
        EXCLUDE USING gist
        ( cast("butlerId" AS text) WITH =,
          EXTRACT(dow FROM lower("dateRange")) WITH =,
          "dateRange" WITH &&
        );
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('workBlocks');
};
