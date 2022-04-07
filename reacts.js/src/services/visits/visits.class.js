/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  find(params) {
    const knex = this.knex;
    const startDate = params.query.startDate || new Date();
    const endDate = params.query.endDate || new Date();

    const select = [knex.raw('vp.*')]
    const query = knex.with('unfilteredVisits', knex.select(select).from(function () {
      const innerQuery = this.distinct(knex.raw('on ("visitPlans"."id", "rc"."date") "rc"."date" as "date"'))
        .select(
          {serviceId: 'visitPlans.serviceId'},
          {clientId: 'services.clientId'},
          {butlerId: 'serviceButlers.butlerId'},
          {hourlyPayOverride: 'serviceButlers.hourlyPayOverride'},
          {serviceButlerComment: 'serviceButlers.comment'},
          {activeFrom: 'serviceButlers.activeFrom'},
          {daysSinceAssigned: 'serviceButlers.dateTimeCreated'},
          {visitPlanId: 'visitPlans.id'},
          {visitPlanDateRange: 'visitPlans.dateRange'},
          {timeWindow: 'visitPlans.timeWindow'},
          {alternativeStartDate: 'visitPlans.alternativeStartDate'},
          {alternativeEndDate: 'visitPlans.alternativeEndDate'},
          {alternativeWindowStartTime: 'visitPlans.alternativeWindowStartTime'},
          {alternativeWindowEndTime: 'visitPlans.alternativeWindowEndTime'},
          {visitPlanRecurrence: 'visitPlans.recurrence'},
          {duration: 'visitPlans.duration'},
          {hourlyRateOverride: 'visitPlans.hourlyRateOverride'},
          {visitPlanComment: 'visitPlans.comment'},
          {serviceAddressId: 'serviceAddresses.id'},
          {geopoint: 'serviceAddresses.geopoint'},
          {numberOfRequests: 'visitPlans.numberOfRequests'}
        )
        .from('visitPlans')
        .joinRaw(`CROSS JOIN LATERAL
                      (SELECT *
                      FROM generate_recurrences("visitPlans"."recurrence", lower("visitPlans"."dateRange"),
                                                least(upper("visitPlans"."dateRange"), ?)) AS "date"
                      ) AS "rc"`, endDate)
        .leftJoin('serviceAddresses', 'serviceAddresses.serviceId', 'visitPlans.serviceId')
        .leftJoin('serviceButlers', 'serviceButlers.serviceId', 'visitPlans.serviceId')
        .leftJoin('services', 'services.id', 'visitPlans.serviceId')
        .where('rc.date', '>=', startDate)
        .where('rc.date', '<', endDate)
        .andWhere('serviceButlers.activeFrom', '<=', knex.raw('rc.date'))
        .andWhere('serviceAddresses.activeFrom', '<=', knex.raw('rc.date'))
        .orderBy('visitPlans.id', 'asc')
        .orderBy('rc.date', 'asc')
        .orderBy('serviceAddresses.activeFrom', 'desc')
        .orderBy('serviceButlers.activeFrom', 'desc')
        .as('vp')

        if (params.query.serviceState) {
          innerQuery.andWhere('serviceAddresses.state', '=', params.query.serviceState);
        }
        if(params.query.attachCheckinStatus) {
          innerQuery.leftJoin('butlerVisitCheckinStatus', 'butlerVisitCheckinStatus.visitPlanId', 'visitPlans.id')
          innerQuery.select({butlerVisitCheckinStatus: 'butlerVisitCheckinStatus.butlerConfirmsCanAttendVisit'})
        }

        if (params.query.withoutPaymentDetail) {
          innerQuery.leftJoin('butlers', 'butlers.id', 'serviceButlers.butlerId')
          innerQuery.leftJoin('clients', 'clients.id', 'services.clientId')
          innerQuery.leftJoin('serviceInvoicing', 'serviceInvoicing.serviceId', 'services.id')
          innerQuery.select(
            'butlers.email as butler.email',
            'butlers.firstName as butler.firstName',
            'butlers.lastName as butler.lastName',
            'clients.email as client.email',
            'clients.phoneNumber as client.phoneNumber',
            'clients.firstName as client.firstName',
            'clients.lastName as client.lastName',
            'clients.dateTimeCreated as client.dateTimeCreated',
            'serviceInvoicing.paymentMethod',
          )
        }
    })
      .leftJoin(knex.raw(`(select p."serviceId", generate_series("startDate", "endDate" - 1, '1 day')::date as "Date"
              from
                  (select id,
                          "serviceId",
                          "dateRange",
                          lower("dateRange") as "startDate",
                          case when upper("dateRange") is null then ? else upper("dateRange") end as "endDate"
                  from "servicePauses"
              )p)sp`, endDate), function() {
                this.on('vp.serviceId', '=', 'sp.serviceId').andOn('vp.date', '=', 'sp.Date')
              })
          .whereNull('sp.Date')
    ).select('*')
    .from('unfilteredVisits');

    if (params.query.butlerId) {
      if (params.query.butlerId.$in) {
        query.whereIn('butlerId', params.query.butlerId.$in);
      }
      else {
        query.andWhere('butlerId', '=', params.query.butlerId);
      }
    }

    if (params.query.clientId) {
      if (params.query.clientId.$in) {
        query.whereIn('clientId', params.query.clientId.$in);
      }
      else {
        query.andWhere('clientId', '=', params.query.clientId);
      }
    }

    if (params.query.visitPlanId) {
      if (params.query.visitPlanId.$nin) {
        query.whereNotIn('visitPlanId', params.query.visitPlanId.$nin);
      } else if (params.query.visitPlanId.$in) {
        query.whereIn('visitPlanId', params.query.visitPlanId.$in);
      } else {
        query.andWhere('visitPlanId', '=', params.query.visitPlanId);
      }
    }

    if (params.query.giveExtraButlerData) {
      const butlersCount = knex.raw('(select count(id) as "butlersCount" from "serviceButlers" where "serviceButlers"."butlerId" = vp."butlerId" and "serviceButlers"."serviceId" = vp."serviceId")')
      const visitsCount = knex.raw(`(select count(id) as "visitsCount" from "visitPlans" where "visitPlans"."serviceId" = vp."serviceId" and lower("dateRange") >= vp."activeFrom" and lower("dateRange") < current_date)`)
      select.push(butlersCount)
      select.push(visitsCount)
    }

    if (params.query.serviceId) {
      if (params.query.serviceId.$in) {
        query.whereIn('serviceId', params.query.serviceId.$in);
      } else {
        query.andWhere('serviceId', '=', params.query.serviceId);
      }
    }

    query.orderBy('unfilteredVisits.visitPlanId', 'asc')
    query.orderBy('unfilteredVisits.date', 'asc')

    // console.log(query.toString())
    //here we execute the query
    return query.then(result => {
      return Promise.resolve(result);
    });

  }

  /*find(params) {
    const knex = this.knex;

    const startDate = params.query.startDate || new Date();
    const endDate = params.query.endDate || new Date();

    let query = this.knex
      .with('unfilteredVisits', function () {
        const innerQuery = this.distinct(
          knex.raw('on ("visitPlans"."id", "rc"."date") "rc"."date" as "date"')
        )
          .from('visitPlans')
          .select([
            'visitPlans.serviceId as serviceId',
            'services.clientId as clientId',
            'serviceButlers.butlerId as butlerId',
            'serviceButlers.hourlyPayOverride as hourlyPayOverride',
            'serviceButlers.comment as serviceButlerComment',
            'serviceButlers.activeFrom as activeFrom',
            'visitPlans.id as visitPlanId',
            'visitPlans.dateRange as visitPlanDateRange',
            'visitPlans.timeWindow as timeWindow',
            'visitPlans.alternativeStartDate as alternativeStartDate',
            'visitPlans.alternativeEndDate as alternativeEndDate',
            'visitPlans.alternativeWindowStartTime as alternativeWindowStartTime',
            'visitPlans.alternativeWindowEndTime as alternativeWindowEndTime',
            'visitPlans.recurrence as visitPlanRecurrence',
            'visitPlans.duration as duration',
            'visitPlans.hourlyRateOverride as hourlyRateOverride',
            'visitPlans.comment as visitPlanComment',
            'serviceAddresses.id as serviceAddressId',
            'serviceAddresses.geopoint as geopoint'
          ])
          .joinRaw(
            `cross join lateral (
              select * from generate_recurrences(
                "visitPlans"."recurrence",
                lower("visitPlans"."dateRange"),
                least(upper("visitPlans"."dateRange"), ?)
              ) as "date"
              where not exists (
                select 1
                from "servicePauses"
                where "servicePauses"."serviceId" = "visitPlans"."serviceId" and
                      "date" <@ "servicePauses"."dateRange"
              )
            ) as "rc"
            `,
            endDate
          )
          .leftJoin(
            'serviceAddresses',
            'serviceAddresses.serviceId',
            'visitPlans.serviceId'
          )
          .leftJoin(
            'serviceButlers',
            'serviceButlers.serviceId',
            'visitPlans.serviceId'
          )
          .leftJoin('services', 'services.id', 'visitPlans.serviceId')
          .where('rc.date', '>=', startDate)
          .where('rc.date', '<', endDate)
          .andWhere('serviceButlers.activeFrom', '<=', knex.raw('rc.date'))
          .andWhere('serviceAddresses.activeFrom', '<=', knex.raw('rc.date'))
          .orderBy('visitPlans.id', 'asc')
          .orderBy('rc.date', 'asc')
          .orderBy('serviceAddresses.activeFrom', 'desc')
          .orderBy('serviceButlers.activeFrom', 'desc');

        if (params.query.serviceState) {
          innerQuery.andWhere('serviceAddresses.state', '=', params.query.serviceState);
        }
        if (params.query.withoutPaymentDetail) {
          innerQuery.leftJoin('butlers', 'butlers.id', 'serviceButlers.butlerId')
          innerQuery.leftJoin('clients', 'clients.id', 'services.clientId')
          innerQuery.leftJoin('serviceInvoicing', 'serviceInvoicing.serviceId', 'services.id')
          innerQuery.select(
            'butlers.email as butler.email',
            'butlers.firstName as butler.firstName',
            'butlers.lastName as butler.lastName',
            'clients.email as client.email',
            'clients.phoneNumber as client.phoneNumber',
            'clients.firstName as client.firstName',
            'clients.lastName as client.lastName',
            'clients.dateTimeCreated as client.dateTimeCreated',
            'serviceInvoicing.paymentMethod',
          )
        }
      })
      .select('*')
      .from('unfilteredVisits');

    if (params.query.butlerId) {
      if (params.query.butlerId.$in) {
        query.whereIn('butlerId', params.query.butlerId.$in);
      }
      else {
        query.andWhere('butlerId', '=', params.query.butlerId);
      }
    }

    if (params.query.clientId) {
      if (params.query.clientId.$in) {
        query.whereIn('clientId', params.query.clientId.$in);
      }
      else {
        query.andWhere('clientId', '=', params.query.clientId);
      }
    }

    if (params.query.visitPlanId) {
      if (params.query.visitPlanId.$nin) {
        query.whereNotIn('visitPlanId', params.query.visitPlanId.$nin);
      } else if (params.query.visitPlanId.$in) {
        query.whereIn('visitPlanId', params.query.visitPlanId.$in);
      } else {
        query.andWhere('visitPlanId', '=', params.query.visitPlanId);
      }
    }


    if (params.query.serviceId) {
      if (params.query.serviceId.$in) {
        query.whereIn('serviceId', params.query.serviceId.$in);
      } else {
        query.andWhere('serviceId', '=', params.query.serviceId);
      }
    }

    console.log(query.toString())
    //here we execute the query
    return query.then(result => {

      return Promise.resolve(result);
    });
  }*/

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
