
exports.up = async function (knex, Promise) {
  await knex.schema.table('services', function (table) {
    table.string('couponCode');
  });
};

exports.down = async function (knex, Promise) {
  await knex.schema.table('services', function (table) {
    table.dropColumn('couponCode');
  });
};
