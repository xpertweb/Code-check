/* eslint-disable no-unused-vars */

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get("knexClient");
  }

  /*
    churn cases
    - visit is one off and start date is < days since churned (one off visits have no end date)
    - for other visit plans if end date < days since churned
    - by default value for daysSinceChurned is 3
    */
  async find(params) {
    const daysSinceChurned = parseInt(params.query.daysSinceChurned) || 3;

    const clientsQuery = await this.knex.raw(`
    with subq as (select "serviceId" from
        "visitPlans" where "serviceId" NOT IN(
          select "serviceId"
          from "visitPlans"
          where ((lower("dateRange")>=current_date::date and "recurrence"='n')
          or ((upper("dateRange") IS NULL or upper("dateRange")>=current_date::date) and "recurrence"!='n'))
          group by "serviceId"
        )
        and ((lower("dateRange")>=current_date::date - interval '`+daysSinceChurned+` days' and "recurrence"='n' and lower("dateRange")<current_date::date)
          or (upper("dateRange") IS NOT NULL and upper("dateRange")>=current_date::date- interval '`+daysSinceChurned+` days' and "recurrence"!='n' and upper("dateRange")<current_date::date))
        group by "serviceId")
        

      select "serviceId", "clients"."id" as "id",min("firstVisitDate") as "firstVisitDate", max("t"."lastVisitDate") as "lastVisitDate", "clients"."email" ,
      "clients"."phoneNumber",
      "clients"."firstName",
      "clients"."lastName",
      "clients"."doNotSendNotifications" from (select "subq"."serviceId",
      min(lower("visitPlans"."dateRange")) as "firstVisitDate",
      case when "visitPlans"."recurrence"='n' THEN max(lower("dateRange"))
      ELSE max(upper("dateRange"))
      END as "lastVisitDate"
      from subq 
      LEFT JOIN  "visitPlans" ON "subq"."serviceId" = "visitPlans"."serviceId" 
      group by "subq"."serviceId","visitPlans"."recurrence"
      ) t
      LEFT JOIN  "services" ON "services"."id" = "t"."serviceId" 
      LEFT JOIN  "clients" ON "clients"."id" = "services"."clientId" 
      where ("clients"."dateTimeCreated"<current_date::date - interval '2 days')
      group by "serviceId", "email", "phoneNumber", "firstName", "lastName", "doNotSendNotifications", "clients"."id"

    `)
    // console.log(clientsQuery.toString());
    return clientsQuery.rows;
  }

  getChurnedClientsSubQuery(daysSinceChurned){
    return this.knex.raw(`
      SELECT "clientId" as cid
      FROM services
      left join "visitPlans" on "visitPlans"."serviceId" = services.id
      where ("visitPlans".recurrence = 'n' and lower("visitPlans"."dateRange") < current_date::date - interval '`+daysSinceChurned+` days')
      OR ("visitPlans".recurrence != 'n' and upper("visitPlans"."dateRange") IS NOT null and
        upper("visitPlans"."dateRange") < current_date::date - interval '`+daysSinceChurned+` days')
    `);
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};

module.exports = function (options) {
  return new Service(options);
}
module.exports.Service = Service;
