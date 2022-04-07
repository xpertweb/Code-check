const {LocalDate} = require('js-joda');
const getActiveVisitPlans = require('./getActiveVisitPlans');
module.exports = (startDate,visit,servicesBelongingToAllClients, visitPlansBelongingToAllServices, visitsBelongingToClient) => {
  var futurePlans = [];
  var servicesBelongingToClient = servicesBelongingToAllClients.filter(function (s) {
    return s.clientId == visit.clientId;
  });
  var plansBelongToClient = visitPlansBelongingToAllServices.filter(function (vp) {
    return !!servicesBelongingToClient.find(function (sbtc) {
      return sbtc.id == vp.serviceId;
    });
  });
  let firstVisitOfThisService = true; //get future visit plans

  try {
    var nextDate = LocalDate.parse(startDate);

    if (futurePlans.length === 0) {
      visitsBelongingToClient = visitsBelongingToClient.sort((a, b) => new Date(a.date.toString()) - new Date(b.date.toString()));
      const nextVisit = visitsBelongingToClient.filter(x=> x.visitPlanRecurrence.toString() != 'n')[0]; // get the first visit plan which is not a one-off
      if (nextVisit) {
        
        futurePlans = [...plansBelongToClient.filter(x => x.id == nextVisit.visitPlanId)];

        futurePlans[0] = Object.assign({}, futurePlans[0], {
          startDate: nextVisit.date.toString()
        });
      }
    }


    if (futurePlans.length == 0) {
      futurePlans = getActiveVisitPlans(plansBelongToClient, nextDate);
    }

    var previousPlans = plansBelongToClient.filter(function (vp) {
      return LocalDate.parse(vp.startDate).isBefore(nextDate);
    });

    if (previousPlans && previousPlans.length > 0) {
      firstVisitOfThisService = false;
    }

    if (futurePlans.length > 0) {
      futurePlans = futurePlans.sort(function (x, y) {
        return new Date(x.startDate) - new Date(y.startDate);
      });
    }
  } catch (ex) {
    console.log(ex);
  }
  return futurePlans;
};