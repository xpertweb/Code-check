
exports.up = async function(knex) {
  await knex.schema.createTable('butlerTeams', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.string('name', 255).notNullable();
    t.string('createdBy', 255).notNullable();
    t.datetime('dateTimeCreated');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('butlerTeams');
};