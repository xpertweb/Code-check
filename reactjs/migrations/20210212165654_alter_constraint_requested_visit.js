exports.up = async function(knex, Promise) {
    await knex.raw(`ALTER TABLE public."requestedVisits" DROP CONSTRAINT requestedvisits_visitplanid_butlerid_unique`);
    await knex.schema.table('requestedVisits', function(t) {
      t.unique(['visitPlanId', 'butlerId','dateOfVisitRequested']);
    });
};

exports.down = async function(knex, Promise) {
   await knex.raw(`ALTER TABLE public."requestedVisits" DROP CONSTRAINT requestedvisits_visitplanid_butlerid_dateofvisitrequested_uniqu`);
   await knex.schema.table('requestedVisits', function(t) {
      t.unique(['visitPlanId', 'butlerId']);
   });
};