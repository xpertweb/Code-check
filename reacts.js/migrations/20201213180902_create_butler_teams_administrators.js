
exports.up = async function(knex) {
  await knex.schema.createTable('butlerTeamsAdministrators', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.uuid('butlerId').notNullable();
    t.uuid('butlerTeamId').notNullable();
    t.foreign('butlerId').references('butlers.id');
    t.foreign('butlerTeamId').references('butlerTeams.id').onDelete('CASCADE');
    t.unique(['butlerId','butlerTeamId']);
    t.string('createdBy');
    t.datetime('createdAt');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('butlerTeamsAdministrators');
};
