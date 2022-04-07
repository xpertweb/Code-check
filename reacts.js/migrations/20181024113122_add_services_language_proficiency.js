exports.up = async function(knex) {
  await knex.schema
    .table('services', function(t) {
      t.integer('languageProf');
    })
    .raw(
      'ALTER TABLE "services" add constraint check_services_language_prof check ("languageProf" BETWEEN 0 AND 2);'
    );
};

exports.down = async function(knex) {
  await knex.schema.table('services', function(t) {
    t.dropColumn('languageProf');
  });
};
