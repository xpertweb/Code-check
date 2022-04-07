const distanceBetweenGeoPoints = require('../../../helpers/distance-between-geo-points');
const { LocalTime, ChronoUnit } = require('js-joda');

/* eslint-disable */

const HOURS_PER_MINUTE = 0.016666667;

export const serializeFloatTime = timeString => {
  const t = LocalTime.parse(timeString);
  return t.hour() + (t.minute() / 60);
};

export const deserializeFloatTime = floatTimeHours => {
  const sec = Math.floor(floatTimeHours * 3600) + 1;
  const secClipped = Math.min(Math.max(sec, 0), 86399); // Ensure range is valid
  return LocalTime
    .ofSecondOfDay(secClipped)
    .truncatedTo(ChronoUnit.MINUTES)
    .toString();
};

export const roundHoursToNearest5Min = (hours) => {
  return Math.round(hours * 12) / 12.0;
}

export const travelHoursBetweenGeopoints = (geopoint1, geopoint2, car) => {
  const distKm = distanceBetweenGeoPoints(geopoint1.lat, geopoint1.lng, geopoint2.lat, geopoint2.lng);
  const minutesPerKm = car ? 1.3 : 3.5;
  const minutes = 15 + (distKm * minutesPerKm);
  const hours = minutes * HOURS_PER_MINUTE;
  return hours;
};


