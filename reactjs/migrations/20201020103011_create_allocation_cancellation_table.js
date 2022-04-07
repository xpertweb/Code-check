exports.up = async function(knex, Promise) {
    const exists = await knex.schema.hasTable('allocationCancellation');

    if (exists) return;

    await knex.schema.createTableIfNotExists('allocationCancellation', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

        table.uuid('serviceId').notNullable();
        table.foreign('serviceId').references('services.id');

        table.date('dateOfVisitCancelled').notNullable();
        table.string('comment');
        table.string('lastModifiedBy');
        table.datetime('dateTimeCreated').notNullable();
    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTableIfExists('allocationCancellation');
};
