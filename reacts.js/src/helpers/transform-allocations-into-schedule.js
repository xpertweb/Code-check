module.exports = (butlersWithAllocations) => {

  let scheduledVisits = [];

  //for each butler we have visits for a particular date, we iterate the visits and generate scheduled visits
  butlersWithAllocations.forEach((butler) => {
    butler.anchoredVisits.forEach((visitForTheDay) => {
      const visitData = {
        serviceId: visitForTheDay.serviceId,
        butlerId : visitForTheDay.butlerId,
        futurestRecurrence: (visitForTheDay.futurePlans[visitForTheDay.futurePlans.length - 1] || visitForTheDay.visitPlanRecurrence).recurrence,
        visitPlanId: visitForTheDay.visitPlanId,
        recurrence: visitForTheDay.visitPlanRecurrence,
        startDate: visitForTheDay.date,
        startTime: visitForTheDay.startTime,
        duration: visitForTheDay.duration,
        clientFullName: (visitForTheDay.client.firstName + ' ' + visitForTheDay.client.lastName),
        windowStartTime: visitForTheDay.windowStartTime,
        windowEndTime: visitForTheDay.windowEndTime,
        geopoint: visitForTheDay.geopoint,
        preferredVisitTime:visitForTheDay.preferredVisitTime,
        activeFrom: visitForTheDay.activeFrom
      };
      scheduledVisits.push(visitData);
    });
  });

  return scheduledVisits;
};
