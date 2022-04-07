exports.up = async function(knex, Promise) {
    return await knex.schema.table('butlerVisitCheckinStatus', function(t) {
      //it allows to generate ticket on Zendesk
      t.boolean('butlerCancelledVisitBefore24hrs').defaultTo(false);
    });
  };
  
  exports.down = async function(knex, Promise) {
    await knex.schema.table('butlerVisitCheckinStatus', function(t) {
      t.dropColumn('butlerCancelledVisitBefore24hrs');
    });
  };