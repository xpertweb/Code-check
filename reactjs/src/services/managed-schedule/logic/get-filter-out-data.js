const { Period, LocalDate } = require('js-joda');

module.exports = async (app,earliestVisit,lastVisit,butlersList)=>{
  
  const visits = await app.service('visits').find({
    query: {
      startDate: earliestVisit.startDate.toString(),
      endDate: LocalDate.parse(lastVisit.startDate.toString()).plus(Period.ofDays(1)).toString(),//match the right end of the date
      butlerId: {
        $in: (butlersList.map(x => x.butler.id))
      }
    }
  });
  const workDays = await app.service('workDays').find({
    query: {
      butlerId: {
        $in: (butlersList.map(x => x.butler.id))
      },
      startDate: earliestVisit.startDate.toString(),
      endDate: LocalDate.parse(lastVisit.startDate.toString()).plus(Period.ofDays(1)).toString() //match the righ end of the date
    }
  });
  return [
    visits,
    workDays
  ];
};