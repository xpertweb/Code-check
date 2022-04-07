
exports.up = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.string('policeCheckDocumentUrl',1000);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('policeCheckDocumentUrl');
  });
};

