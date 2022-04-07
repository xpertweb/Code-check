exports.up = async function(knex, Promise) {
    await knex.raw(`ALTER TABLE public."butlerPauses" DROP CONSTRAINT butlerpauses_butlerid_unique`);
    await knex.schema.table('butlerPauses', function(t) {
      t.unique(['butlerId','dateRange']);
    });
};

exports.down = async function(knex, Promise) {
   await knex.raw(`ALTER TABLE public."butlerPauses" DROP CONSTRAINT butlerpauses_butlerid_daterange_unique`);
};