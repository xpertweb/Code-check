exports.up = async function (knex, Promise) {
  await knex.schema.table('allocationSettings', function (table) {
    table.integer('daysToAllocateFromToday').defaultTo(1);
  });


  await knex('allocationSettings').update(
    {
      daysToAllocateFromToday: 2,
    }
  );
};


exports.down = async function (knex, Promise) {
  await knex.schema.table('allocationSettings', function (table) {
    table.dropColumn('daysToAllocateFromToday');
  });
};
