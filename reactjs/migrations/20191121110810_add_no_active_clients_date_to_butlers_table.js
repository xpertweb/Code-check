
exports.up = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.datetime('noActiveClientsDate');
    table.date('lastVisitDate');
  });

  await knex.schema.table('services', function (table) {
    table.boolean('serviceAllocated').defaultTo(false);
  });

};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('noActiveClientsDate');
    table.dropColumn('lastVisitDate');
  });

  
  await knex.schema.table('services', function (table) {
    table.dropColumn('serviceAllocated');
  });
};
