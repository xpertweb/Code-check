
exports.up = async function(knex, Promise) {
  await knex.schema.table('allocationSettings', function (table) {
    table.string('commitmentPeriodThresholdSetting');
  });

  await knex('allocationSettings').update(
    {
      commitmentPeriodThresholdSetting: 'lessthanonemonth',
    }
  );
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('allocationSettings', function (table) {
    table.dropColumn('commitmentPeriodThresholdSetting');
  });
};