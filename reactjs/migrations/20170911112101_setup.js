
exports.up = function(knex, Promise) {
  return knex.schema.raw('\
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; \
  CREATE EXTENSION IF NOT EXISTS "btree_gist"; \
  CREATE TYPE timerange AS range (subtype = time); \
');
};

exports.down = function(knex, Promise) {
  return knex.schema.raw('\
  DROP TYPE timerange; \
  ');
};
