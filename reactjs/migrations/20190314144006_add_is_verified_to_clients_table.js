
exports.up = async function (knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.boolean('isVerified').defaultTo(false);
    table.string('verifyToken');
    table.date('verifyExpires');
    table.json('verifyChanges');
    table.string('resetToken');
    table.date('resetExpires');
  });

  await knex('clients').update( 'isVerified', true);

};

exports.down = async function (knex, Promise) {
  await knex.schema.table('clients', function (table) {
    table.dropColumn('isVerified');
    table.dropColumn('verifyToken');
    table.dropColumn('verifyExpires');
    table.dropColumn('verifyChanges');
    table.dropColumn('resetToken');
    table.dropColumn('resetExpires');
  });
};


