
exports.up = async function(knex, Promise) {
  await knex.schema.table('services', function (table) {
    table.datetime('lastVisitCreationDate');
    table.date('lastVisitDate');
    table.boolean('active').defaultTo(false);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('services', function (table) {
    table.dropColumn('lastVisitCreationDate');
    table.dropColumn('lastVisitDate');
    table.dropColumn('active');
  });
};
