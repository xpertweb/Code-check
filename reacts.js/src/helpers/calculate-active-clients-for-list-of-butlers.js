const _ = require('lodash');
const {LocalDate} = require('js-joda');
const RECURRENCE_ENUM = require('./enum/recurrence-enum');

module.exports = async (listOfButlerIds,app,knex) => {
  let allServicesOfAllButlers;
  let gotOnlyAffectedServiceButlersNotAll = false;

  
  if (listOfButlerIds && listOfButlerIds.length > 0){

    // TODO: we could not calculate active clients for allocate butlers but that would mean a lot of butlers would suddenly have active clients. We need a better system
    // const butlersToIgnore = await app
    //   .service('butlers')
    //   .find({
    //     query: {
    //       firstName: 'ALLOCATE'
    //     }
    //   });
    // //do not calculate active butlers for allocate butlers
    // listOfButlerIds = listOfButlerIds.filter(x=> !butlersToIgnore.find(z=> z.id == x));

      
    gotOnlyAffectedServiceButlersNotAll = true;
    allServicesOfAllButlers = await app.service('serviceButlers').find({
      query :{
        butlerId : {
          $in : listOfButlerIds
        }
      }
    });

  } else {
    allServicesOfAllButlers = await app.service('serviceButlers').find();
  }

  const allAffectedServiceIds = _.uniq(allServicesOfAllButlers.map(x=> x.serviceId));

  if (gotOnlyAffectedServiceButlersNotAll){
    allServicesOfAllButlers = await app.service('serviceButlers').find({
      query :{
        serviceId : {
          $in : allAffectedServiceIds
        }
      }
    });
  }

  const allActiveServiceIds = allAffectedServiceIds;
  
  const allFullServices = await app.service('services').find({
    query: {
      id: {
        $in: allActiveServiceIds,
      }
    }
  });

  const allActiveButlers = allServicesOfAllButlers.filter(x => allActiveServiceIds.find(z => z == x.serviceId));

  

  const getServicesWithActiveVisitPlans = async ()=>{
    const allVisitPlansOfAllActiveServices = await app.service('visitPlans').find({
      query: {
        serviceId: {
          $in: allActiveServiceIds
        }
      }
    });
    const visitsOrganizedByService  = _.groupBy(allVisitPlansOfAllActiveServices,'serviceId');
    const result = [];
    Object.keys(visitsOrganizedByService).map(serviceId =>{
      const allVisitPlansOfService = visitsOrganizedByService[serviceId];
      const oneOffAfterToday = (visitPlan)=>{
        if (visitPlan.recurrence == RECURRENCE_ENUM.OneOff){
          return LocalDate.parse(visitPlan.startDate.toString()).isAfter(LocalDate.now());
        } else {
          return true;
        }
      };
      const activeVisitPlans = allVisitPlansOfService.filter(x=> oneOffAfterToday(x) && (!x.endDate || LocalDate.parse(x.endDate.toString()).isAfter(LocalDate.now())));
      if (activeVisitPlans.length > 0){
        result.push(allFullServices.find(x=> x.id == serviceId));
      }
    });
    return result;
  };
  const servicesWithActiveVisitPlans = await getServicesWithActiveVisitPlans();
  
  
  const servicesOrganizedByButler = _.groupBy(allActiveButlers, 'butlerId');

  const getServicesWhereCurrentButlerIsLastAssigned = (butlerId) => {
    const result = [];
    const butlersOrganizedByService = _.groupBy(allActiveButlers, 'serviceId');
    Object.keys(butlersOrganizedByService)
      .filter(serviceId => butlersOrganizedByService[serviceId].find(x => x.butlerId == butlerId))
      .filter(serviceId => {
        const butlers = allServicesOfAllButlers.filter(x=> x.serviceId == serviceId);
        const sortedButlers = butlers.sort((a, b) => {
          return new Date(b.activeFrom.toString()) - new Date(a.activeFrom.toString());
        });

        if (sortedButlers[0].butlerId == butlerId) {
          const foundService = servicesWithActiveVisitPlans.find(z => z.id == serviceId);
          if (foundService) { //this means the service is not churned
            result.push(foundService);
          }
        }
      });
    return result;
  };

  const butlersWithActiveClients = [];
  for (const butlerId of Object.keys(servicesOrganizedByButler)) {
    //not updating butlers who are frozen
    const serviceData = servicesOrganizedByButler[butlerId];
    const servicesWhereCurrentbutlerIsLastAssigned = getServicesWhereCurrentButlerIsLastAssigned(butlerId);
    const uniqueClients = _.uniq(servicesWhereCurrentbutlerIsLastAssigned.map(x => x.clientId));
    const serviceWithButlerData = serviceData.find(x=> (x.butler || {}).id == butlerId);
    //const butler = await app.service('butlers').get(butlerId);
    butlersWithActiveClients.push({
      //firstName : butler.firstName,
      //lastName: butler.lastName,
      //email: butler.email,
      id : butlerId,
      clients : servicesWhereCurrentbutlerIsLastAssigned.map(x=> x.client.firstName + ' ' + x.client.lastName),
      activeClients : uniqueClients.length,
      previousActiveClients: serviceWithButlerData.butler.activeClients
    });
  }

  for (const butler of butlersWithActiveClients) {
    // const sortedVisitPlans = (allVisitPlansOfService.sort((a, b) => new Date((b.endDate || null)) - new Date((a.endDate || null))));
    // const lastVisitDate = sortedVisitPlans.map(x => x.endDate)[0];

    await knex('butlers').where('id', butler.id).update({
      activeClients: butler.activeClients,
      noActiveClientsDate: (butler.activeClients == 0 && butler.previousActiveClients > 0 ? (new Date().toISOString()).slice(0, 19).replace('T', ' ') : null)
    });
  }
  return butlersWithActiveClients;
};
