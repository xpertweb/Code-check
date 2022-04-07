const _ = require('lodash');
const winston = require('winston');

exports.AllocationsWithExtraPay = class Service {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  async bulkUpdate(records){
    return await this.knex.raw(`
      UPDATE services set
        "urgentExtraPayAmount" = (json_data ->> 'urgentExtraPayAmount')::numeric,
        "urgentExtraPayProvided" = (json_data ->> 'urgentExtraPayProvided')::boolean
      from json_array_elements('${JSON.stringify(records)}') json_data
      where services.id = (json_data ->> 'id')::uuid;
    `);
  }

  async find(params) {
    if(params.query.all){
      // reset amount
      return await this.knex.raw(`
        UPDATE services set
          "urgentExtraPayAmount" = 0,
          "urgentExtraPayProvided" = false
          where "urgentExtraPayProvided"=true;
      `);
    }

    // patch services
    const urgentExtraPayAmount = params.query.urgentExtraPayAmount;
    const query = {
      dumpAuxMulti:params.query.dumpAuxMulti,
      startDate:params.query.startDate,
      endDate:params.query.endDate
    };
    const visits = await this.app.service('allocations').find({query});
    await this.mutateVisits(visits, urgentExtraPayAmount);

    // return await this.app.service('allocations').find({query});
    return visits;
  }

  async mutateVisits(visits, extraPay) {
    const records = [];
    for (const {anchoredVisits} of visits) {
      for (const visit of anchoredVisits) {
        const {id, urgentExtraPayProvided, urgentExtraPayAmount} = visit.service;
        if (!urgentExtraPayProvided || (urgentExtraPayAmount != extraPay)) {
          // mutate the current visit
          visit.service.urgentExtraPayAmount = extraPay;
          visit.service.urgentExtraPayProvided = true;

          // to update database
          records.push({
            id: id,
            urgentExtraPayAmount: extraPay,
            urgentExtraPayProvided: true,
          });
        }
      }
    }

    // mutate database
    if (records.length > 0){
      await this.bulkUpdate(records);
    }
  }

  async create(data, options) {
    const {
      serviceIds,
      urgentExtraPayAmount,
      urgentExtraPayProvided
    } = data;

    const record = serviceIds.map(id => ({
        id,
        urgentExtraPayAmount,
        urgentExtraPayProvided
    }));

    try {
      await this.bulkUpdate(record);
    } catch (error) {
      winston.error({event:'allocations-with-extra-pay', error});
      return {status: 'failed'};
    }

    return {status: 'success'}
  }
};
