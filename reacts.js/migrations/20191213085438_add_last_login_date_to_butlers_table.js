
exports.up = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.datetime('dateTimeLastLogin');
  });

};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('dateTimeLastLogin');
  });
  
};
