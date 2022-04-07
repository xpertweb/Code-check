exports.up = async function(knex) {
  await knex.schema.createTable('serviceMarketing', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('serviceId').notNullable();
    t.foreign('serviceId').references('services.id');
    t.unique('serviceId');

    t.string('marketingChannel');
    t.string('campaign');
    t.string('salesperson');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('serviceInvoicing');
};
