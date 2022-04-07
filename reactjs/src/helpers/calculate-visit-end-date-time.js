const { Duration} = require('js-joda');

module.exports = (visitStartDateTime,duration)=>{
  const splitDuration = duration.split(':');
  const minutesDuration = Duration.parse(`PT${splitDuration[0]}H${splitDuration[1]}M${splitDuration[2]}S`).toMinutes();
  return visitStartDateTime.plusMinutes(minutesDuration);
};
