exports.up = function(knex, Promise) {
  return knex.schema.alterTable('butlerFeedbackAppeals', function(t) {
    t.string('description', 500).alter();
    t.string('reason', 500).alter();
    t.string('butlerReason', 500).alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('butlerFeedbackAppeals', function(t) {
    t.string('description', 255).alter();
    t.string('reason', 255).alter();
    t.string('butlerReason', 255).alter();
  });  
};
