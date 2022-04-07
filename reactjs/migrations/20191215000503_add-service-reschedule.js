
exports.up = async function(knex, Promise) {
  const exists = await knex.schema.hasTable('serviceReschedule');

  if (exists) return;

  await knex.schema.createTable('serviceReschedule', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');
    table.date('visitDate').notNullable();
    table.string('rescheduleStatus').defaultTo('notcontacted').notNullable();

    table.specificType('timeWindow', 'timerange').notNullable();
  }).raw(`
    ALTER TABLE "serviceReschedule"
      ADD CONSTRAINT "nonEmptyTimeWindow" CHECK ("timeWindow" <> \'empty\');`);
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists('serviceReschedule');
};
