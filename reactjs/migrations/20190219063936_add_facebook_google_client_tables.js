exports.up = async function (knex) {
  knex.schema.createTableIfNotExists('facebookClients', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.string('facebookToken');
    table.string('email');
    table.string('facebookId');
    table.string('firstName');
    table.string('lastName');
  }).then(()=>{
    knex.schema.createTableIfNotExists('googleClients', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('googleToken');
      table.string('email');
      table.string('googleId');
      table.string('firstName');
      table.string('lastName');
    }).then(async ()=>{
      await knex.schema.table('clients', async function (table) {
        table.uuid('googleId');
        table.unique('googleId');
        table.foreign('googleId').references('googleClients.id');
    
        await knex.raw('ALTER TABLE users ALTER COLUMN "facebookId" SET DATA TYPE UUID USING (uuid_generate_v1mc());');
        
        table.unique('facebookId');
        table.foreign('facebookId').references('facebookClients.id');
      });

    });
  });
};

exports.down = async function (knex) {

  await knex.schema.table('clients', function (table) {
    table.dropColumn('googleId');
  });

  await knex.schema.dropTableIfExists('googleClients');
  await knex.schema.dropTableIfExists('facebookClients');

  

};

