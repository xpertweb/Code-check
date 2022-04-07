exports.up = async function(knex) {
  await knex.schema.createTable('butlerPauses', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('butlerId').notNullable();
    t.foreign('butlerId').references('butlers.id');
    t.unique('butlerId');
    t.specificType('dateRange', 'daterange').notNullable();
    t.string('reason');
  }).raw(`
  ALTER TABLE "butlerPauses"
    ADD CONSTRAINT "nonEmptyDateRange" CHECK ("dateRange" <> \'empty\');
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTable('butlerPauses');
};
