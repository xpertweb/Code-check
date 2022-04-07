const _ = require('lodash');
const logger = require('winston');
const calculateDistance = require("../../helpers/distance-between-geo-points");
const addEquipmentConditions = require("../../helpers/add-equipment-conditions");
class GetButlersNearLocation {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  async find(data) {
    const visit = data.query.visit
    const butlerLimit = parseInt(data.query.limit) || 50
    let lat1 = _.get(visit, 'geopoint.x');
    let lon1 = _.get(visit, 'geopoint.y');
    let fileteredButlers = [];
    let service = await this.knex.select('*').from('services').where('services.id', visit.serviceId);
    let equipmentConditions = addEquipmentConditions(service[0]);

    if (lat1 && lon1) {
      let query = this.getNearbyButlersQuery(service, equipmentConditions, butlerLimit, lat1, lon1)
      let records = await this.knex.raw(query);
      fileteredButlers = _.get(records, 'rows');
    }
    fileteredButlers = _.uniqBy(fileteredButlers, 'butlerId')
    return fileteredButlers
  }

  getNearbyButlersQuery(service, equipmentConditions, butlerLimit, lat1, lon1){
    return `
    WITH localButlers AS (
      select
        "butlerId",
        "activeClients",
        "onFreeze",
        "dateTimeLastLogin",
        "lastVisitDate",
        butlers."dateTimeCreated",
        "email",
        "verified",
        "firstName",
        "lastName",
        "phoneNumber",
        "neverCall",
        "doNotCallToday",
        "disinfectantProvided",
        "furnitureAssemblyProvided",
        "steamCleanerProvided",
        "carpetDryCleaningProvided",
        "spraysWipesAndBasicsProvided",
        "mopProvided","vacuumProvided",
        "handlesPets",
        "packingServiceProvided",
        "gardeningServiceProvided",
        ROUND(calculate_distance(${lat1}, ${lon1}, geopoint[0], geopoint[1])::numeric, 2) as visitDistance
      from "butlerAddresses"
      left join "butlers" on "butlerId"=butlers.id
      WHERE CASE WHEN '${service[0].genderPref}'!='n'
      THEN butlers.gender='${service[0].genderPref}'
      ELSE butlers.gender IS NOT NULL
      END
      )
      SELECT *
      FROM localButlers
      WHERE "dateTimeLastLogin" is not null ${equipmentConditions}
      AND visitDistance <=25
      AND "neverCall" is not true
      AND ("doNotCallToday" < current_date::date OR "doNotCallToday" is null)
      order by "dateTimeLastLogin" desc, visitDistance asc
      limit ${butlerLimit}`
    }

  get(id, params) {
    return Promise.resolve(id);
  }

  create(data, params) {
    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  async patch(id, data) {
    const {neverCall, doNotCallToday} = data
    try {
      if (neverCall) {
        await this.app
          .service('butlers')
          .patch(id, {neverCall})
          .then(res => {
            return res
          })
      }
      if (doNotCallToday) {
        console.log("check here", doNotCallToday)
        await this.app
          .service('butlers')
          .patch(id, {doNotCallToday})
          .then(res => {
            return res
          })
      }
    } catch(err) {
      logger.error(`Error updating butler : ${err.message || JSON.stringify(ex)}`);
    }
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
};

module.exports = function (options) {
  return new GetButlersNearLocation(options);
}
module.exports.Service = GetButlersNearLocation;
