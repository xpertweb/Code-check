exports.up = async function (knex, Promise) {

  await knex('churnCategories').insert([
    {
      type: 'PostFVChurn',
      reason: 'PostFVChurn - Unhappy - Butler Late'
    },
    {
      type: 'Regular Churn',
      reason: 'Regular Churn - Unreliability - Butler No Show'
    },
    {
      type: 'Regular Churn',
      reason: 'Regular Churn - Unreliability - Butler Late'
    }
  ]);
};

exports.down = async function (knex, Promise) {

  await knex('churnCategories')
    .where('type', 'PostFVChurn')
    .where('reason', 'PostFVChurn - Unhappy - Butler Late')
    .del();


  await knex('churnCategories')
    .where('type', 'Regular Churn')
    .where('reason', 'Regular Churn - Unreliability - Butler No Show')
    .del();

  await knex('churnCategories')
    .where('type', 'Regular Churn')
    .where('reason', 'Regular Churn - Unreliability - Butler Late')
    .del();
};
