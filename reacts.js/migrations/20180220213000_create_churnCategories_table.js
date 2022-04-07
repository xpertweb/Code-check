exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('churnCategories', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('reason');
      table.string('type');
    })
    .then(() => {
      return knex('churnCategories').insert([
        { type: 'general', reason: 'RECONFIRM' },
        { type: 'general', reason: 'FV RECONFIRM' },
        { type: 'FVChurn', reason: 'FVChurn - Change In Circumstances' },
        { type: 'FVChurn', reason: 'FVChurn - Price' },
        { type: 'FVChurn', reason: 'FVChurn - Competitor' },
        { type: 'FVChurn', reason: 'FVChurn - No Equipment' },
        { type: 'FVChurn', reason: 'FVChurn - Non-Fixed Times' },
        { type: 'FVChurn', reason: 'FVChurn - Other/Unknown' },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Happy - Change in Circumstances'
        },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Happy - Indefinite Reschedule'
        },
        { type: 'PostFVChurn', reason: 'PostFVChurn - Happy - Price' },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Unhappy - Butler No Show'
        },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Unhappy - Quality or Inefficiency'
        },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Unhappy - Unprofessional'
        },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Unhappy - Scheduling Issue'
        },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Unhappy - Non-Fixed Times'
        },
        {
          type: 'PostFVChurn',
          reason: 'PostFVChurn - Unhappy - Other Business Issue'
        },
        { type: 'PostFVChurn', reason: 'PostFVChurn - Other/Unknown' },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Change in circumstances (Cost)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Change in circumstances (Travelling)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Change in circumstances (Moving)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Change in circumstances (Miscellaneous)'
        },
        {
          type: 'Regular Churn',
          reason:
            'Regular Churn - Change in long-term butler (No previous substitute)'
        },
        {
          type: 'Regular Churn',
          reason:
            'Regular Churn - Change in long-term butler (Good previous substitutes)'
        },
        {
          type: 'Regular Churn',
          reason:
            'Regular Churn - Change in long-term butler (Poor previous substitutes)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Indefinite pause'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Service Quality (Multiple poor butlers)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Service Quality (Single poor butler)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Unreliability (General business problem)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Unreliability (Business scheduling problems)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Unreliability (Butler scheduling problems)'
        },
        {
          type: 'Regular Churn',
          reason: 'Regular Churn - Unreliability (Too many short-term butlers)'
        },
        { type: 'Regular Churn', reason: 'Regular Churn - Other' }
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('churnCategories');
};
