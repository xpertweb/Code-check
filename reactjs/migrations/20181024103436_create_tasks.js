exports.up = async function(knex) {
  await knex.schema.createTable('tasks', function(t) {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    t.string('name');
  });
  await knex('tasks').insert([
    { name: 'cleaning' },
    { name: 'ironing' },
    { name: 'tidying' },
    { name: 'washing' },
    { name: 'laundry' }
  ]);
};

exports.down = async function(knex) {
  await knex.schema.dropTable('tasks');
};
