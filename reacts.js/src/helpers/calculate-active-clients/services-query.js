const { LocalDate } = require('js-joda');


/**
 * Select uniq services from serviceButlers table
 *
 * When butlerIds are provided, filter services by butler ids
 * */
function uniqServicesQuery(knex, butlerIds){
  const query = knex
    .select(knex.raw('distinct on ("serviceId") "serviceId"'))
    .from('serviceButlers');


  if (butlerIds.length > 0){
    query.whereIn('butlerId', butlerIds);
  }

  // remove paused services
  query.whereNotExists(function(){
    this.select(knex.raw('1'))
      .from('servicePauses')
      .where('servicePauses.serviceId', knex.raw('"serviceButlers"."serviceId"'))
      .andWhere('servicePauses.dateRange', '@>', knex.raw(`'${LocalDate.now()}'::date`));
  });

  // remove churned services
  query.whereNotExists(function(){
    this.select(knex.raw('1'))
      .from('serviceChurns')
      .where('serviceChurns.serviceId', knex.raw('"serviceButlers"."serviceId"'))
  });

  return query;
}


export async function getPausedServices(knex){
  const query = knex.select(knex.raw('distinct on ("serviceId") "serviceId" as id'))
    .from('serviceButlers').whereExists(function(){
      this.select(knex.raw('1'))
        .from('servicePauses')
        .where('servicePauses.serviceId', knex.raw('"serviceButlers"."serviceId"'))
        .andWhere('servicePauses.dateRange', '@>', knex.raw(`'${LocalDate.now()}'::date`));
    });

  const resp = await query;

  return resp.reduce((map, item) => map.set(item.id, true), new Map());
}

export function cleanButlerIds(butlerIds){
  if (Array.isArray(butlerIds)){
    return butlerIds.filter(item => item);
  }

  return [];
}

export async function getServiceButlers(knex, butlerIds){
  const query = knex.select(
    'butlers.id',
    'butlers.activeClients',
    'butlers.email',
  ).from('butlers');

  if (butlerIds.length > 0){
    query.whereIn('id', butlerIds);
  }else{
    // skip frozen butlers with 0 active clients,
    // by default the count will be zero so lets ignore frozen butlers
    // query.whereNot(knex.raw('("onFreeze" = TRUE AND "activeClients" = 0)'));
  }

  return await query;
}


export async function requestRequiredData(knex, butlerIds){
  const queryString = query(knex, butlerIds);
  return await knex.raw(queryString);
}

/**
 * Main query to get all required data
 */
export function query(knex, butlerIds){
  const servicesQuery = uniqServicesQuery(knex, butlerIds);

  return `WITH "uniqueServices" AS (${servicesQuery}),
    "activeVisitPlans" AS (
      SELECT
        id,
        "serviceId",
        lower("visitPlans"."dateRange") AS "startDate",
        upper("visitPlans"."dateRange") AS "endDate",
        recurrence
      FROM "visitPlans"
      WHERE "serviceId" IN (SELECT "serviceId" FROM "uniqueServices")
    ),
    "servicesWithLastAssignedButlers" as (
      SELECT DISTINCT ON ("serviceId")
        "serviceId",
        "butlerId"
      FROM "serviceButlers"
      WHERE "serviceId" IN (SELECT "serviceId" FROM "uniqueServices")
      ORDER BY
        "serviceId",
        "activeFrom" DESC
    ),
    "clientsWithServices" AS (
      SELECT "id", "clientId"
      FROM "services"
      WHERE "id" IN (SELECT "serviceId" FROM "uniqueServices")
    )

    SELECT
      json_build_object('type', 'visitPlans', 'data', json_agg(row_to_json("activeVisitPlans"))) "rows"
    from "activeVisitPlans"

    UNION ALL SELECT
      json_build_object('type', 'servicesWithLastAssignedButlers', 'data', json_agg("servicesWithLastAssignedButlers")) "rows"
    from "servicesWithLastAssignedButlers"

    UNION ALL SELECT
      json_build_object('type', 'clientsWithServices', 'data', json_agg("clientsWithServices")) "rows"
    from "clientsWithServices"
  `;
}
