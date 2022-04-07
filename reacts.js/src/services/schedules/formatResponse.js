function visitPlan(data){
  const [windowStartTime, windowEndTime] = splitRange(data.timeWindow);
  const [startDate, endDate] = splitRange(data.dateRange);
  const {duration} = data;

  if (data.hourlyRateOverride !== null){
    data.hourlyRateOverride = data.hourlyRateOverride.toFixed(2);
  }

  delete data.dateRange;
  delete data.timeWindow;
  delete data.startDate;
  delete data.duration;

  data['startDate'] = startDate;
  data['endDate'] = endDate;
  data['windowStartTime'] = windowStartTime;
  data['windowEndTime'] = windowEndTime;
  data['duration'] = duration;

  return data;
}

function client(data){
  if (data.dateTimeCreated){
    data.dateTimeCreated =  new Date(data.dateTimeCreated);
  }

  return data;
}

function serviceAddress(data){
  const [lng, lat] = splitRange(data.geopoint);
  delete data.geopoint;
  data['geopoint'] = {lat: parseFloat(lat), lng: parseFloat(lng)};
  return data;
}

function service(data){
  data.clientRating = data.clientRating.toFixed(2);
  data.clientLifetimeValue = data.clientLifetimeValue.toFixed(2);
  if (data.lastVisitCreationDate){
    data.lastVisitCreationDate = new Date(data.lastVisitCreationDate);
  }

  return data;
}

function splitRange(range){
  const [_first, _end] = range.split(',');
  const first = _first.substring(1);
  const end = _end.slice(0, -1);

  return [
    first === '' ? undefined : first,
    end === '' ? undefined : end,
  ];
}

const formatters = {
  services: service,
  clients: client,
  serviceAddresses: serviceAddress,
  visitPlans: visitPlan,
};

function formatOutput(type, data){
  const fmt = formatters[type];
  if (fmt){
    return fmt(data);
  }

  return data;
}

module.exports = {
  formatOutput
};
