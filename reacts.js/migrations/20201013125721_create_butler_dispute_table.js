
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('butlerDisputes', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('historicVisitId').notNullable();
      table.enu('approvalStatus', ['new','approved','denied']).notNullable();
      table.string('approvalReason');
      table.string('disputeReason').notNullable();
      table.string('disputeQuesAns').notNullable();
      table.string('snapShotUrl').notNullable();
      table.uuid('opsButlerId').notNullable();
      table.uuid('opsClientId');
      table.boolean('visitWasNotRecorded').defaultTo(false);
      table.datetime('dateOfCreation').notNullable();
      table.datetime('dateOfModification');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('butlerDisputes');
  };
  
