exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('serviceCallHistory', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.boolean('unchurnAttempt').defaultTo(false);
    table.boolean('firstVisitFollowUpCall').defaultTo(false);
    table.boolean('debtorCall').defaultTo(false);

    table.string('unchurnAttemptComment').defaultTo('');
    table.string('firstVisitFollowUpCallComment').defaultTo('');
    table.string('debtorCallComment').defaultTo('');

    table.uuid('serviceId');
    table.foreign('serviceId').references('services.id');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('serviceCallHistory');
};