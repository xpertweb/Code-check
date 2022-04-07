const _ = require('lodash');
const { LocalDate } = require('js-joda');
// const getActiveVisitPlans = require('../getActiveVisitPlans');
module.exports = function () {
  // eslint-disable-line no-unused-vars
  return async function populateScheduleAux(hook) {
    if (
      !hook.params.auxMulti &&
      !_.get(hook, 'params.query.dumpAuxMulti', false) &&
      hook.result.length > 1
    ) {
      return hook;
    }

    const buildIdMap = models => {
      let map = {};
      models.forEach(model => {
        map[model.id] = model;
      });
      return map;
    };

    const clients = await hook.app
      .service('clients')
      .find();
    const services = await hook.app
      .service('services')
      .find();
    const serviceAddresses = await hook.app
      .service('serviceAddresses')
      .find();
    const handoverNotes = await hook.app
      .service('serviceHandovers')
      .find({
        query: {
          serviceId: {
            $in: services.map(x => x.id)
          }
        }
      });
      
    const visitPlans = await hook.app
      .service('visitPlans')
      .find({
        query: {
          serviceId: {
            $in: services.map(x => x.id)
          }
        }
      });
    const nextDate = hook.params.query && hook.params.query.startDate && LocalDate.parse(hook.params.query.startDate);

    let visits = [];

    if (nextDate) {
      visits = await hook.app
        .service('visits')
        .find({
          query: {
            serviceId: {
              $in: services.map(x => x.id)
            },
            startDate: nextDate.plusDays(1).toString(),
            endDate: nextDate.plusWeeks(4).toString()
          }
        });
    }

    const clientsMap = buildIdMap(clients);
    const servicesMap = buildIdMap(services);
    const serviceAddressesMap = buildIdMap(serviceAddresses);

    const newResult = hook.result.map(schedule => {

      return {
        ...schedule,
        anchoredVisits: (schedule.anchoredVisits || []).map(
          anchoredVisit => {
            let futurePlans = [];
            let servicesBelongingToClient = services.filter(s => s.clientId === anchoredVisit.clientId);
            let visitsBelongingToClient = visits.filter(x => servicesBelongingToClient.find(z => z.id == x.serviceId));
            let plansBelongToClient = visitPlans.filter(vp => !!servicesBelongingToClient.find(sbtc => sbtc.id === vp.serviceId));
            let firstVisitOfThisService = true;

            //get future visit plans
            try {
              // futurePlans = nextDate ? plansBelongToClient.filter(vp => LocalDate.parse((vp.startDate)).isAfter(nextDate)) : plansBelongToClient;
              //the above doesnt take into account visits, which are instances of visit plans, and have different start dates
              if (futurePlans.length === 0) {
                visitsBelongingToClient = visitsBelongingToClient.sort((a, b) => new Date(a.date.toString()) - new Date(b.date.toString()));
                const nextVisit = visitsBelongingToClient[0];


                if (nextVisit) {
                  
                  futurePlans = [...plansBelongToClient.filter(x => x.id == nextVisit.visitPlanId)];

                  futurePlans[0] = Object.assign({}, futurePlans[0], {
                    startDate: nextVisit.date.toString()
                  });
                }
              }

              const previousPlans = plansBelongToClient.filter(vp => LocalDate.parse((vp.startDate)).isBefore(nextDate));
              if (previousPlans && previousPlans.length > 0) {
                firstVisitOfThisService = false;
              }

              if (futurePlans.length > 0) {
                futurePlans = futurePlans.sort((x, y) => new Date(x.startDate) - new Date(y.startDate));
              }
            } catch (ex) {
              // eslint-disable-next-line
              console.error(ex);
            }

            return {
              ...anchoredVisit,
              futurePlans: futurePlans,
              firstVisitOfThisService: firstVisitOfThisService,
              client: clientsMap[anchoredVisit.clientId],
              service: servicesMap[anchoredVisit.serviceId],
              serviceAddress: serviceAddressesMap[anchoredVisit.serviceAddressId],
              handoverNotes: handoverNotes.find(x=> x.serviceId == anchoredVisit.serviceId)
            };
          }
        )
      };
    });

    return {
      ...hook,
      result: newResult
    };
  };
};
