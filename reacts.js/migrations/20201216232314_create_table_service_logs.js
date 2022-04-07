
exports.up = async function (knex, Promise) {
  await knex.schema.createTableIfNotExists('serviceLogs', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('serviceId').notNullable();
    table.string('logText',1000);
    table.json('logJson');
    table.string('createdBy');
    table.date('createdDateTime');
    table.foreign('serviceId').references('services.id');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.dropTableIfExists('serviceLogs');
};
