const distanceBetweenGeoPoints = require('./distance-between-geo-points');

module.exports = (visits) => {
  let maxDistanceFound = 0;

  for (let i = 0; i < visits.length; i++) {
    for (let j = i + 1; j < visits.length; j++) {
      const distance = distanceBetweenGeoPoints(
        visits[i].geopoint.lat,
        visits[i].geopoint.lng,
        visits[j].geopoint.lat,
        visits[j].geopoint.lng);
      if (distance > maxDistanceFound) {
        maxDistanceFound = distance;
      }
    }
  }

  return maxDistanceFound;
};
