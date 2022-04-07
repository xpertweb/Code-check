exports.up = async function(knex) {
  await knex.schema
    .table('butlers', function(t) {
      t.integer('cleaningExp');
    })
    .raw(
      'ALTER TABLE "butlers" add constraint check_butlers_cleaning_exp check ("cleaningExp" BETWEEN 0 AND 3);'
    );
};

exports.down = async function(knex) {
  await knex.schema.table('butlers', function(t) {
    t.dropColumn('cleaningExp');
  });
};
