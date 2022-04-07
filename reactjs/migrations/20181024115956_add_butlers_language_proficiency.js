exports.up = async function(knex) {
  await knex.schema
    .table('butlers', function(t) {
      t.integer('languageProf');
    })
    .raw(
      'ALTER TABLE "butlers" add constraint check_butlers_language_prof check ("languageProf" BETWEEN 0 AND 2);'
    );
};

exports.down = async function(knex) {
  await knex.schema.table('butlers', function(t) {
    t.dropColumn('languageProf');
  });
};
