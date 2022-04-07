exports.up = (knex, Promise) => {
    return knex.schema.table('visitPlans', (t) => {
      t.integer('totalRatingOfButlersWhoRequested').default(0);
    });
};
  
exports.down = (knex, Promise) => {
    return knex.schema.table('visitPlans', (t) => {
      t.dropColumn('totalRatingOfButlersWhoRequested');
    });
};
  