exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists('butlerFeedbackAppeals', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.primary(['butlerId', 'feedbackId'])
    table.uuid('butlerId').notNullable()
    table.foreign('butlerId').references('butlers.id')
    table.uuid('feedbackId').notNullable()
    table.foreign('feedbackId').references('serviceFeedback.id').onDelete('CASCADE')
    table.string('description')
    table.enu('status', ['approved', 'denied', 'new']).defaultTo('new')
    table.string('reason')
    table.string('butlerReason')
    table.date('dateOfCreation')
    table.date('dateStatusChanged')
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('butlerFeedbackAppeals');
};
