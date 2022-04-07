exports.up = async function(knex) {
  await knex.schema.createTable('serviceHandovers', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('serviceId').notNullable();
    t.string('note');
    t.date('creationDate');
    t.foreign('serviceId').references('services.id');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('serviceHandovers');
};
