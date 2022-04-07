
exports.up = async function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "serviceButlers"
    DROP CONSTRAINT "serviceButlers_butlerAllocatedByMethod_check",
    ADD CONSTRAINT "serviceButlers_butlerAllocatedByMethod_check" 
    CHECK ("butlerAllocatedByMethod" IN ('manual', 'managedschedulesystem','butlerrequestedthisvisit','trs'))
  `);
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('serviceButlers', function(t) {
    t.dropColumn('butlerAllocatedByMethod');
  });
};

