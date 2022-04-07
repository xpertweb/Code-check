exports.up = async function(knex) {
  await knex.schema.createTable('serviceInvoicing', function(t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('serviceId').notNullable();
    t.foreign('serviceId').references('services.id');
    t.unique('serviceId');

    t.string('recipientName');
    t.string('recipientEmail');
    t.enu('frequency', ['w', 'f', 'm']);
    t.boolean('requiresTaxInvoice');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('serviceInvoicing');
};
