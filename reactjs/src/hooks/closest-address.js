
const { BadRequest } = require('@feathersjs/errors');
const logger = require("winston");
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  async function findStation (hook,type,fieldName) {
    const { resultField } = options;
    return  await  hook.app.get('gmaps').placesNearby({
      location: {lat:JSON.stringify(hook.data[resultField].lat),lng:JSON.stringify(hook.data[resultField].lng)},
      type: type,
      rankby:'distance'
    }).asPromise().then(response => {
      if (response.json.results.length === 0) {
        hook.data[fieldName] = null;
        return Promise.resolve(true)
      }
      let gepoints = hook.data['closestGeoPoints'] || {}
      hook.data[fieldName] = response.json.results[0].name;
      gepoints[fieldName] = { lat:response.json.results[0].geometry.location.lat, lng:response.json.results[0].geometry.location.lng };
      hook.data['closestGeoPoints'] = gepoints
      return Promise.resolve(true)
    }).catch(e=>{
      return Promise.reject(e)
    });
  }
  return async function closestAddress (hook) {
    try {
      await findStation(hook,'bus_station','closestBusStop')
      await findStation(hook,'train_station','closestTrainStation')
      await findStation(hook,'light_rail_station','closestTramStation')
      return Promise.resolve(hook);
    }
    catch (e) {
      console.log("Error getting closestAddress-->",e)
      logger.error("Error getting closestAddress: " + e);
      return Promise.resolve(hook);
    }
  };
};
