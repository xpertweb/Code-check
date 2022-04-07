
exports.up = async function(knex, Promise) {
    const exists = await knex.schema.hasTable('requestedVisits');

    if (exists) return;
    
    await knex.schema.createTable('requestedVisits', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
  
      table.uuid('butlerId').notNullable();
      table.foreign('butlerId').references('butlers.id');

      table.uuid('visitPlanId').notNullable();
      table.foreign('visitPlanId').references('visitPlans.id');

      table.unique(['visitPlanId', 'butlerId']);

      table.datetime('dateTimeRequestCreated').notNullable();
      table.datetime('dateTimeRequestProcessed');
      table.boolean('processed').defaultTo(false);
      table.string('comment');
    });
  };
  
  exports.down = async function(knex, Promise) {
    await knex.schema.dropTableIfExists('requestedVisits');
  };
  


