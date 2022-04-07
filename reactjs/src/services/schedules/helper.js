function parseWhereIn(ids){
  if (ids.length === 0){
    return 'null';
  }

  const uniqueIds = new Set(ids);
  return [...uniqueIds].map(s => `'${s}'`).join(',');
}

function workDayHash(butlerId, date) {
  return `${butlerId}#${date.toString()}`;
}

function makeHashMap(workDays){
  return workDays.reduce((map, workDay) => {
    const hash = workDayHash(workDay.butlerId, workDay.date);
    return map.set(hash, workDay)
  }, new Map());
}

function analyseSchedule(schedule){
  if (schedule.trunc) {
    return {
      status: 'error',
      message: 'Schedule has too many visits to be computed (extra visits have been truncated)'
    };
  }

  if (schedule.butlerAvailable === false) {
    return {
      status: 'warning',
      message: 'Butler is not available or has incomplete address information on this day'
    };
  }

  if (schedule.constraintsSatisfied === false) {
    return {
      status: 'warning',
      message: 'Constraint has been violated'
    };
  }

  return {status: 'ok'};
}


function collectClientServices(services){
  const clientServices = new Map();
  services.forEach(service => {
    if (clientServices.has(service.clientId)){
      const coll = clientServices.get(service.clientId);
      coll.push(service);
      clientServices.set(service.clientId, coll);
    }else{
      clientServices.set(service.clientId, [service]);
    }
  });

  return clientServices;
}

module.exports = {
  workDayHash,
  makeHashMap,
  parseWhereIn,
  analyseSchedule,
  collectClientServices
};
