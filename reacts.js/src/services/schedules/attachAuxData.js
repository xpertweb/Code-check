const { LocalDate } = require('js-joda');
const { collectClientServices } = require('./helper');
const { analyseSchedule } = require('./helper');


const isStartDateBeforeNextDate = (startDate, nextDate) => LocalDate.parse(startDate).isBefore(nextDate);

async function attachAuxData(auxVisitsPromise, auxDataMapPromise, finalResult, nextDate) {
  const dataMap = await auxDataMapPromise;
  const visitPlansValues = [...dataMap.visitPlans.values()];


  const clientServices = collectClientServices(dataMap.services);
  const auxVisits = await auxVisitsPromise;

  const ret = finalResult.map(schedule => {
    const anchoredVisits = (schedule.anchoredVisits || []).map(anchoredVisit => {
      let futurePlans = [];
      const services = clientServices.get(anchoredVisit.clientId);
      let visitsBelongingToClient = auxVisits.filter(x => services.find(s => s.id == x.serviceId));
      const clientVisitPlans = visitPlansValues.filter(vp => !!services.find(s => s.id === vp.serviceId));
      let firstVisitOfThisService = true;

      try {
        if (futurePlans.length === 0) {
          visitsBelongingToClient = visitsBelongingToClient.sort((a, b) => new Date(a.date.toString()) - new Date(b.date.toString()));
          const nextVisit = visitsBelongingToClient[0];
          if (nextVisit) {
            futurePlans = [...clientVisitPlans.filter(x => x.id == nextVisit.visitPlanId)];
            futurePlans[0] = Object.assign({}, futurePlans[0], {
              startDate: nextVisit.date.toString()
            });
          }
        }

        const previousPlans = clientVisitPlans.filter(cvp => isStartDateBeforeNextDate(cvp.startDate, nextDate));
        if (previousPlans && previousPlans.length > 0) {
          firstVisitOfThisService = false;
        }

        if (futurePlans.length > 0) {
          futurePlans = futurePlans.sort((x, y) => new Date(x.startDate) - new Date(y.startDate));
        }
      } catch (ex) {
        console.error(ex);
      }

      return {
        ...anchoredVisit,
        futurePlans: futurePlans,
        firstVisitOfThisService: firstVisitOfThisService,
        client: dataMap.clients.get(anchoredVisit.clientId),
        service: dataMap.services.get(anchoredVisit.serviceId),
        serviceAddress: dataMap.serviceAddresses.get(anchoredVisit.serviceAddressId),
        handoverNotes: dataMap.serviceHandovers.get(anchoredVisit.serviceId)
      };
    });


    return {...schedule, anchoredVisits, analysis: analyseSchedule(schedule)};
  });
  return ret;
}
module.exports = {
  attachAuxData
};
