/* eslint-disable no-unused-vars */
const axios = require('axios');
const logger = require('winston'); 
const _ = require('lodash');

class CurrentGeoLocation {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async create(data) {
    const current_address = {}
    try {
      const response = await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}&sensor=false&key=${process.env.MAPS_API_KEY}`,
      });
      const addresses = _.get(response, 'data.results.0.address_components') 
      addresses.map((address) => {
        address.types.map((type) => {
          if(type === 'postal_code') current_address.postcode = address.short_name
          else if(type === 'administrative_area_level_1') {current_address.state = address.short_name, current_address.stateName = address.long_name}
          else if(type === 'administrative_area_level_2') current_address.locale = address.short_name
          else if(type === 'country') current_address.country = address.long_name
        })
      })
    } catch (e) {
      return logger.error('Error : ' + e.message);
    }
    return Promise.resolve(current_address);
  }

  get(id, params) {
    return Promise.resolve(id);
  }

  find(data, params) {
    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
};

module.exports = function (options) {
  return new CurrentGeoLocation(options);
}
module.exports.Service = CurrentGeoLocation;
