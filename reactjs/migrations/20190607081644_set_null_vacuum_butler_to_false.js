
exports.up = async function(knex, Promise) {
  await knex('butlers').update( 'vacuumAndMopProvided', false).where('vacuumAndMopProvided',null);
};

exports.down = async function(knex, Promise) {
  await knex('butlers').update( 'vacuumAndMopProvided', false).where('vacuumAndMopProvided',null);
};
