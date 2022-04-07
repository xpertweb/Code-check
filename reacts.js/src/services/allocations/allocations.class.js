/* eslint-disable no-unused-vars */
//const getVisitsNotClashingWithButlerSchedule = require('../../helpers/get-visits-not-clashing-with-butler-schedule');
const getFuturePlans = require('../../helpers/getFuturePlans');
const _ = require('lodash');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    console.log("getting allocations",params.query);
    let visitsQuery = { query: params.query };
    const { fullUserDetails, butlerIds, filterVisitsBasedOnPreferences } = params;
    let butlerFilter;
    butlerFilter = (x => butlerIds.indexOf(x.butlerId) > -1);
    delete visitsQuery.query.butlerId;

    if (filterVisitsBasedOnPreferences && fullUserDetails && fullUserDetails.isButler && fullUserDetails.address) {
      visitsQuery.query.serviceState = fullUserDetails.address.state;
    }

    let visits = await this.app
      .service('visits')
      .find(visitsQuery);


    let services;
    if (filterVisitsBasedOnPreferences && fullUserDetails && fullUserDetails.isButler) {
      //add filters for butlers trying to get schedules
      const servicesQuery = {
        id: {
          $in: _.uniq(visits.map(x => x.serviceId)),
        },
        genderPref: {
          $in: [fullUserDetails.gender, 'n'] //gender filter
        }
      };

      // if a butler handles pets they should get services with AND without pets
      let getServicesWithPets;
      if (!fullUserDetails.handlesPets) { //pets filter
        getServicesWithPets = false;
        servicesQuery.pets = getServicesWithPets;
      }

      
      

      services = await this.app
        .service('services')
        .find({ query: servicesQuery });

      // Here we filter so that butlers can only see visits which match their equipment settings
      // if (fullUserDetails.spraysWipesAndBasicsProvided != null){
      //   if (fullUserDetails.spraysWipesAndBasicsProvided == false){
      //     // servicesQuery.spraysWipesAndBasicsRequired = {
      //     //   $in: [null,false]
      //     // }; // we cannot query for null, so we need to do the below :
      //     services = services.filter(x=> x.spraysWipesAndBasicsRequired == null || x.spraysWipesAndBasicsRequired == false);
      //   }
      // }
      // if (fullUserDetails.vacuumAndMopProvided != null){
      //   if (fullUserDetails.vacuumAndMopProvided == false){
      //     // servicesQuery.vacuumAndMopRequired = {
      //     //   $in: [null,false]
      //     // }; // we cannot query for null, so we need to do the below :
      //     services = services.filter(x=> x.vacuumAndMopRequired == null || x.vacuumAndMopRequired == false);
      //   }
      // }

      //now get visits which match the filter
      visits = visits.filter(x => services.find(z => z.id == x.serviceId));

      //visits = getVisitsNotClashingWithButlerSchedule(visits,this.app,fullUserDetails,visitsQuery.startDate, visitsQuery.endDate );

    }
    if (butlerFilter && visits.filter) {
      visits = visits.filter(butlerFilter); //we cant do $in butlerId to filter visits so we do this
    }

    const butlers = await this.app
      .service('butlers')
      .find({
        query: {
          id: {
            $in: butlerIds
          }
        }
      });

    const clients = await this.app
      .service('clients')
      .find({
        query: {
          id: {
            $in: visits.map(x => x.clientId)
          }
        }
      });


    const servicesBelongingToAllClients = await this.app
      .service('services')
      .find({
        query: {
          clientId: {
            $in: visits.map(x => x.clientId)
          }
        }
      });

    const serviceAddresses = await this.app
      .service('serviceAddresses')
      .find({
        query: {
          serviceId: {
            $in: visits.map(x => x.serviceId)
          }
        }
      });
    const visitPlansBelongingToAllServices = await this.app
      .service('visitPlans')
      .find({
        query: {
          serviceId: {
            $in: visits.map(x => x.serviceId)
          }
        }
      });

    servicesBelongingToAllClients.forEach(x => {
      x.serviceAddress = serviceAddresses.find(b => b.serviceId == x.id);
    });

    return butlers.map(x => {
      const butlerVisits = visits.filter(b => b.butlerId === x.id);

      const modifiedVisits = butlerVisits.map(visit => {

        visit = Object.assign({},visit,visitPlansBelongingToAllServices.find(x=> x.visitPlanId == visit.visitPlanId));
       
        const visitsBelongingToClient = visits.filter(x=> x.clientId.toString() == visit.clientId.toString());
        visit.client = clients.find(x => x.id == visit.clientId);
        visit.service = servicesBelongingToAllClients.find(b=> b.id == visit.serviceId);
       
        visit.serviceAddress = servicesBelongingToAllClients.find(b=> b.id == visit.serviceId).serviceAddress;
        visit.futurePlans = getFuturePlans(visitsQuery.query.startDate, visit, servicesBelongingToAllClients, visitPlansBelongingToAllServices, visitsBelongingToClient);
        return visit;
      });
      return {
        butler: x,
        anchoredVisits: modifiedVisits,
        date: x.date
      };
    });

  }





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
