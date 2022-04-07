exports.up = async function(knex) {
  await knex('tasks').insert([
    { name: 'dog walking' }
  ]);
};

exports.down = async function(knex) {
  await knex('tasks').where('name', 'dog walking').del();
};
