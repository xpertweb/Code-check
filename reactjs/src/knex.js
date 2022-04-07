const knex = require('knex');
const pgtypes = require('pg').types;
const { LocalDate } = require('js-joda');

module.exports = function() {
  const app = this;
  const { client, connection } = app.get('postgres');

  // Custom type parsers for pgsql->js
  const OID_DATE = 1082;
  pgtypes.setTypeParser(OID_DATE, field => {
    return LocalDate.parse(field);
  });

  const db = knex({ client, connection });

  app.set('knexClient', db);
};
