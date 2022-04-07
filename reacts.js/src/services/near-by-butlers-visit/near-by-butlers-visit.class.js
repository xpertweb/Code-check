const _ = require('lodash');
const moment = require('moment');
const calculateDistance = require("../../helpers/distance-between-geo-points");
const addEquipmentFilter = require("../../helpers/add-equipment-filter");

class NearByButlersVisit {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  notPastVisitDate(visitDate) {
    let visitToday = false;
    if(visitDate){
      const yesterday = moment().subtract(1, 'days');
      const visitDateObj = moment(visitDate);
      visitToday = visitDateObj > yesterday;
    }
    return visitToday;
  }

  async find(params) {
    const {query: { butlerId }} = params
    let uniqueServices = [];

    // get butler details, for whom we search for visits
    let butlerDetails = await this.knex.select('*')
      .from('butlers')
      .where('butlers.id', butlerId)
      .leftJoin('butlerAddresses as ba', 'butlers.id', 'ba.butlerId');
      
    let lat1 = _.get(butlerDetails[0], 'geopoint.x');
    let lon1 = _.get(butlerDetails[0], 'geopoint.y');

    const getUnAllocatedVisitsQuery = {
      query : {
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().add(6, 'days').format("YYYY-MM-DD"),
        getNotEnrolledButlers: true,
        takeNotRealRequestsOnly: true,
        getFrozenButlers: true,
        attachVisitPlans: true,
        getOnlyManagedScheduleButlers:true,
        takeNotRealRequestsOnly:true
      }
    }

    // getting all active services, present in MSP (request Tab in ops)
    const unAllocatedVisits = await this.app.service('managedSchedule').find(getUnAllocatedVisitsQuery)

    for (let unAllocatedVisit of unAllocatedVisits) {
      const {service, service: {client, address}, startDate, geopoint, duration, windowStartTime, windowEndTime} = unAllocatedVisit.visit
      let lat2 = geopoint.lng
      let lon2 = geopoint.lat
      const visitDate = startDate
      const visitDistance = calculateDistance(lat1, lon1, lat2, lon2).toFixed(2)

      // getting unique services which are within 25 km to the butler
      if (!uniqueServices.some(y => y.serviceId === service.id) &&
          visitDistance > 0 && visitDistance <= 25 &&  
          this.notPastVisitDate(visitDate)
        ) {
        uniqueServices.push({
          serviceId : service.id,
          pets : service.pets,
          genderPref : service.genderPref,
          mopRequired : service.mopRequired,
          vacuumRequired : service.vacuumRequired,
          endOfLeaseRequired : service.endOfLeaseRequired,
          steamCleanerRequired : service.steamCleanerRequired,
          disinfectantRequired : service.disinfectantRequired,
          packingServiceRequired : service.packingServiceRequired,
          packingServiceRequired : service.packingServiceRequired,
          gardeningServiceRequired : service.gardeningServiceRequired,
          furnitureAssemblyRequired : service.furnitureAssemblyRequired,
          carpetDryCleaningRequired : service.carpetDryCleaningRequired,
          spraysWipesAndBasicsRequired : service.spraysWipesAndBasicsRequired,
          serviceAddressLine1 : address.line1,
          serviceAddressLine2 : address.line2,
          serviceAddressLocale : address.locale,
          serviceAddressState : address.state,
          serviceAddressPostcode : address.postcode,
          serviceAddressCountry : address.country,
          clientId : client.id,
          clientFirstName : client.firstName,
          clientLastName : client.lastName,
          clientEmail : client.email,
          visitDate : startDate,
          duration: duration,
          timeWindow: windowStartTime + ' - ' + windowEndTime,
          visitDistance,
        })
      }
    }

    // returning equipment filtered visits
    return addEquipmentFilter(uniqueServices, butlerDetails[0]);
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

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
};

module.exports = function (options) {
  return new NearByButlersVisit(options);
}
module.exports.Service = NearByButlersVisit;
