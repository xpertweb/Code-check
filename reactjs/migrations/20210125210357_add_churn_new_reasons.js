
exports.up = async function(knex, Promise) {
  await knex('newChurnCategories').insert([
    { reason: 'Client never booked the service' },
    { reason: 'Subpar Butler Equipment' },
    { reason: 'Payment Concerns' },
    { reason: 'Dislikes automated messaging' },
    { reason: 'App Issues' },
    { reason: 'No longer require the service' },
    { reason: 'Covid' },
    { reason: 'Client wanted a One-Off' },
    { reason: 'Client has another cleaning/company' },
  ]);
};

exports.down = async function(knex, Promise) {

};
