class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(params) { 

    let getButlerInfo = await this.knex.with('subq',  this.knex
      .select(
        't.*',
        this.knex.raw('ROW_NUMBER () OVER (PARTITION BY t."serviceId" ORDER BY "serviceButlers"."activeFrom") as "activeFrom"'),
        this.knex.raw('lower("t"."dateRange") as "visitDate"'),
        'clients.email as clientsEmail',
        'clients.firstName as clientsFirstName',
        'clients.lastName as clientsLastName',
        'butlers.firstName as butlersFirstName',
        'butlers.lastName as butlersLastName',
        'butlers.phoneNumber as butlersPhoneNumber'
      )
      .from(this.knex.raw('(select "serviceId", "dateRange", "recurrence", ROW_NUMBER () OVER (PARTITION BY "serviceId" ORDER BY lower("dateRange")) from "visitPlans") t'))
      .leftJoin('serviceButlers', 'serviceButlers.serviceId', 't.serviceId')
      .leftJoin('services', 'serviceButlers.serviceId', 'services.id')
      .leftJoin('clients', 'services.clientId', 'clients.id')
      .leftJoin('butlers', 'butlers.id', 'serviceButlers.butlerId')
      .where(this.knex.raw('lower("t"."dateRange")'), '=', params.query.startDate)
      .andWhere("activeFrom",'<=', params.query.startDate)
      .andWhere("recurrence",'!=','n')
      .andWhere("row_number",'=','1')
      .whereNotIn('butlers.id',this.knex.raw('select "butlerId" from "serviceExcludedButlers" where "serviceId"="services"."id"'))
      )
      .select('*').from('subq')
      .innerJoin(this.knex.raw('(SELECT "serviceId", MAX("activeFrom") AS "activeFrom" FROM subq GROUP BY "serviceId") as "topActive"'), function() {
        this.on('subq.serviceId', '=', 'topActive.serviceId').andOn('subq.activeFrom', '=', 'topActive.activeFrom')
      })
    // console.log(getButlerInfo.toString());
    
    return getButlerInfo; 
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
