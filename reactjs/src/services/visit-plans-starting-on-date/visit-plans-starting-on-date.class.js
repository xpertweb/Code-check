const {LocalDate} = require('js-joda');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(params) {
    const {startDate} = params.query;
    const parsedDate = LocalDate.parse(startDate); //validation happening here for type date
    const result = await this.knex.raw(`
    SELECT * FROM "public"."visitPlans" where "dateRange"::text like '%${parsedDate.toString()},%' 
    `);
   
    return Promise.resolve(result.rows || []);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


