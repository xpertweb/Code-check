const deg2rad = require('./degrees-to-radians');
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
module.exports = function (lat1,lon1,lat2,lon2) {
  if (lat1 < Number.EPSILON && lon1 < Number.EPSILON || lat2 < Number.EPSILON && lon2 < Number.EPSILON) {
    return 0.0; // Assume any (0,0) input should return zero distance ("invalid")
  }
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; 
  return d; // Distance in km
};
