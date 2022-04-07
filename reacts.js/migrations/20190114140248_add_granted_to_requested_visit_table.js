
exports.up = async function(knex) {
    await knex.schema.table('requestedVisits', function(t) {
      t.boolean('granted').defaultTo(false);
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.table('requestedVisits', function(t) {
      t.dropColumn('granted');
    });
  };
  