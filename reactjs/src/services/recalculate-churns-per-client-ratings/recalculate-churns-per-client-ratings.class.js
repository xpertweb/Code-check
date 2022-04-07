const calculateRatingForButler = require('../../helpers/calculate-scores-for-butler');
const _ = require('lodash');
const { LocalDate } = require('js-joda');
const RECURRENCE_ENUM = require('../../helpers/enum/recurrence-enum');

const getDaysBetweenDates = (firstDate, secondDate) => {
  const date1 = new Date(firstDate);
  const date2 = new Date(secondDate);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

class Service {
  constructor(options) {
    this.options = options || {};
  }



  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }


  async getAllChurnedClients(maximumVisitPlanPriceToCountTowardsCpc) {
    //get all churned services 
    const allServiceChurns = await this.app.service('serviceChurns').find();

    //get unique services
    // const allChurnedServiceIds = allServiceChurns.filter((obj, pos, arr) => {
    //   return arr.map(mapObj => mapObj['serviceId']).indexOf(obj['serviceId']) === pos;
    // }).map(x => x.serviceId);
    let allChurnedServiceIds = allServiceChurns.map(x => x.serviceId);

    const getServicesWithInactiveVisitPlans = async ()=>{
      let allVisitPlansOfAllActiveServices = await this.app.service('visitPlans').find({
        query: {
          serviceId: {
            $nin: allChurnedServiceIds
          }
        }
      });
      allVisitPlansOfAllActiveServices = allVisitPlansOfAllActiveServices.filter(x=> {
        if (!x.hourlyRateOverride){
          return true;
        } else {
          //e.g we dont want to count towards churn visit plans above $35 dollars, because it means those are one/off/trials and if the client leaves after the trial, we dont want to penalize the butler  
          return parseFloat(x.hourlyRateOverride) <= maximumVisitPlanPriceToCountTowardsCpc;
        }
      });


      const visitsOrganizedByService  = _.groupBy(allVisitPlansOfAllActiveServices,'serviceId');
      Object.keys(visitsOrganizedByService).map(serviceId =>{
        const allVisitPlansOfService = visitsOrganizedByService[serviceId];
        const oneOffBeforeToday = (visitPlan)=>{
          if (visitPlan.recurrence == RECURRENCE_ENUM.OneOff){
            return LocalDate.parse(visitPlan.startDate.toString()).isBefore(LocalDate.now());
          } else {
            return false;
          }
        };
        const inactiveVisitPlans = allVisitPlansOfService.filter(x=> oneOffBeforeToday(x) || (x.endDate && LocalDate.parse(x.endDate.toString()).isBefore(LocalDate.now())));
        if (inactiveVisitPlans.length == allVisitPlansOfService.length && !allChurnedServiceIds.find(x=> x == serviceId)){
          allChurnedServiceIds.push(serviceId);
        }
      });
    };
    await getServicesWithInactiveVisitPlans();

    //then find those clients 
    const allChurnedServices = await this.app.service('services').find({
      query: {
        id: {
          $in: allChurnedServiceIds
        }
      }
    });
    const allChurnedClientIds = allChurnedServices.map(x => x.clientId);
    //then check if those clients have no other active services
    const allServicesOfChurnedClients = await this.app.service('services').find({
      query: {
        clientId: {
          $in: allChurnedClientIds
        }
      }
    });
    const churnedClients = [];
    const clientServices = _.groupBy(allServicesOfChurnedClients, 'clientId');

    for (const clientId of Object.keys(clientServices)) {
      const client = clientServices[clientId];
      const allChurnedServicesOfThisClient = allChurnedServices.filter(x => x.clientId == client[0].clientId);
      if (client.length == allChurnedServicesOfThisClient.length) {
        churnedClients.push({ clientId: client[0].clientId, services: client });
      }
    }
    return churnedClients;
  }

  // (Total no. of churned clients last assigned to this butler that had tenure < X days 
  //            divided by
  // (Total no. of churned clients last assigned to this butler < X days + Total no. of existing clients current assigned to this butler)
  async create(params) {

    

    const churnPerClientSettings = (await this.app.service('churnPerClientSettings').find())[0];
     //get all plans within a certain period of time to find/establish the tenure
    const churnedClients = await this.getAllChurnedClients(churnPerClientSettings.maximumVisitPlanPriceToCountTowardsCpc);

    const allChurnedServices = churnedClients.map(x => x.services).reduce(function (pre, cur) {
      return pre.concat(cur);
    });
    const allChurnedServiceIds = allChurnedServices.map(x => x.id);

    const allChurnedServiceButlers = await this.app.service('serviceButlers').find({
      query: {
        serviceId: {
          $in: allChurnedServiceIds
        }
      }
    });

    const butlersOrganizedByService = _.groupBy(allChurnedServiceButlers, 'serviceId');
    //only get the last butlers 
    let lastAssignedButlers = [];
    for (const serviceId of Object.keys(butlersOrganizedByService)){
      const serviceButlers = butlersOrganizedByService[serviceId];
      const sortedButlers = serviceButlers.sort((a,b)=>{
        return new Date(b.activeFrom.toString()) - new Date(a.activeFrom.toString());
      });
      lastAssignedButlers.push(sortedButlers[0]);
    }

    const fitleredServicesOrganizedByButler = _.groupBy(lastAssignedButlers, 'butlerId');
    
    const butlersWithChurnedClients = Object.keys(fitleredServicesOrganizedByButler).map(butlerId => {
      const servicesWhereButlerIsLastAssigned = fitleredServicesOrganizedByButler[butlerId];
      const clientsButlerHadWithinDates = servicesWhereButlerIsLastAssigned.filter(x =>{
        return getDaysBetweenDates(x.activeFrom.toString(), LocalDate.now().toString()) <= churnPerClientSettings.daysOfTenureByButler;
      });
      
      return {
        butlerId: butlerId,
        allChurnedServices: allChurnedServices.filter(x=> servicesWhereButlerIsLastAssigned.find(z=> z.serviceId == x.id)),
        clientsButlerHadWithinDates
      };
    });

    //Total no. of churned clients currently assigned to this butler
    const butlersOrganizedByChurnedClients = butlersWithChurnedClients.map(x => {
      const totalButlerServices = x.allChurnedServices;
      const totalNumberOfNonUniqueClients = totalButlerServices.map(y => y.clientId);
      const totalNumberOfUniqueClients = _.uniq(totalNumberOfNonUniqueClients);
      
      return {
        butlerId: x.butlerId,
        totalChurnedClients: totalNumberOfUniqueClients.length,
        servicesWithChurnedClients: totalButlerServices,
      };
    });
    //Total no. of non churned clients currently assigned to this butler
    const allServicesOfChurnedButlers = await this.app.service('serviceButlers').find({
      query: {
        butlerId: {
          $in: butlersOrganizedByChurnedClients.map(x => x.butlerId)
        }
      }
    });

    const allFullServies = await this.app.service('services').find();
    
    const servicesOrganizedByButler = _.groupBy(allServicesOfChurnedButlers, 'butlerId');
    const butlersOrganizedByClients = Object.keys(servicesOrganizedByButler).map(butlerId => {
      const butlerServices = servicesOrganizedByButler[butlerId];
      const servicesWithChurnedClients = butlersOrganizedByChurnedClients.find(z => z.butlerId == butlerId).servicesWithChurnedClients;
      const servicesWithoutChurnedClients = butlerServices.filter(z => !servicesWithChurnedClients.find(y => y.serviceId == z.serviceId));

      const fullServicesWithoutChurnedClients = allFullServies.filter(x=> servicesWithoutChurnedClients.find(z=> z.serviceId == x.id));
      const nonChurnedClientIds = fullServicesWithoutChurnedClients.map(z => z.clientId);
      let nonChurnedUniqueClients = _.uniq(nonChurnedClientIds);
      nonChurnedUniqueClients = nonChurnedUniqueClients.filter(x=> !churnedClients.find(z=> z.clientId == x));
      return {
        butlerId: butlerId,
        totalNonChurnedClients: nonChurnedUniqueClients.length
      };
    });
    const butlersWithChurnPerClientCalculated = butlersWithChurnedClients.map(x => {
      const totalClientsChurned = butlersOrganizedByChurnedClients.find(z =>  {
        return z.butlerId == x.butlerId;
      }).totalChurnedClients;
      const totalNonChurnedClients = butlersOrganizedByClients.find(z => z.butlerId == x.butlerId).totalNonChurnedClients;
      const churnPerClient = totalClientsChurned / (totalClientsChurned + totalNonChurnedClients);

      return {
        butlerId: x.butlerId,
        churnPerClient: churnPerClient,
        totalNonChurnedClients,
        totalClientsChurned
      };
    });

    for (const butler of butlersWithChurnPerClientCalculated) {
      //not updating butlers who are frozen
      await this.knex('butlers').where('id', butler.butlerId).update({
        churnsPerClientRating: butler.churnPerClient
      });
    }
    return Promise.resolve({ data: [] }); //butlersWithChurnPerClientCalculated
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


