exports.up = async function(knex) {
  await knex.schema.createTable('serviceChurnRisks', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('serviceId').notNullable();
    t.foreign('serviceId').references('services.id');
    t.unique('serviceId');
    t.decimal('riskRating', 5, 2);
    t.string('note');
    t.date('creationDate');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('serviceChurnRisks');
};
