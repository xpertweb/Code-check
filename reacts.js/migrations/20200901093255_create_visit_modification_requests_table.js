
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('visitModificationRequests', table => {

    table.comment('This table will have rows consisting of requests from clients to modify visit details');

    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('clientId').notNullable();
    table.foreign('clientId').references('clients.id');
    table.uuid('serviceId').notNullable();
    table.foreign('serviceId').references('services.id');
    table.uuid('visitPlanId').notNullable();
    table.foreign('visitPlanId').references('visitPlans.id');

    table.date('visitDate').notNullable();
    table.date('preferredDate');
    table.date('preferredDateSecondary');

    table.time('preferredTime');
    table.time('preferredTimeSecondary');

    table.specificType('visitDuration', 'interval');

    table.uuid('butlerId').notNullable();
    table.foreign('butlerId').references('butlers.id');
    table.string('butlerChangeReason', 500);

    table.boolean('modifyAllFutureVisits').notNullable();
    table.enu('status', ['approved', 'denied', 'pending', 'cancelled']).defaultTo('pending');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('visitModificationRequests');
};
