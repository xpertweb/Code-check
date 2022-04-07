/* eslint-disable no-unused-vars */
const getServerProtocol = require('../../helpers/get-server-protocol');
const axios = require('axios');
const qs = require('qs');
const _ = require('lodash');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) { //visits are re-ordered around clients so that they can be filtered for permission settings using clientId

    //TODO FIX : There is a bug here where the schedules are too much and it breaks
    //get all the services of the client
    const clientServices = (await axios({
      method: 'GET',
      baseURL: `${getServerProtocol()}${process.env.FEATHERS_HOST_URL}`,
      url: '/services',
      headers: { Authorization: params.headers.authorization }
    }
    )).data;
    
    //get an admin token
    const token = (await axios({
      method: 'POST',
      baseURL: `${getServerProtocol()}${process.env.FEATHERS_HOST_URL}`,
      url: '/authentication',
      data: {
        email: process.env.ROOT_EMAIL,
        password: process.env.ROOT_PASSWORD,
        strategy: 'operatorLocal'
      }
    }
    )).data.accessToken;

    

    //now get all the butlers assigned to the services of the client
    let serviceIds = clientServices.map(x=> x.id);
    let serviceButlerQuery = {};
    if (serviceIds.length == 0){
      return Promise.resolve([]);
    }
    if (serviceIds.length == 1){
      serviceButlerQuery.serviceId = serviceIds[0];
    } else {
      serviceButlerQuery.serviceId = {
        $in : serviceIds
      };
    }
    const serviceButlers = (await axios({
      method: 'GET',
      headers: { Authorization: token },
      baseURL: `${getServerProtocol()}${process.env.FEATHERS_HOST_URL}`,
      url: '/serviceButlers',
      params: serviceButlerQuery,
      paramsSerializer: function(params) {
        return qs.stringify(params, { indices: false, encodeValuesOnly: true });
      }
    })).data;

    let result = {
      data: []
    };
    
    try { //we need admin access so that we can get the entire schedule of a butler
      // this is so we get accurate start time and end time for visits
      // if we only get 1 client's visit (the one requesting this data), the start times will be all wrong
      // and they will complain to us
      const paramsQueryCopy = Object.assign({},params.query);
      delete paramsQueryCopy.clientId;
      const buterIds = serviceButlers.map(x=> x.butler.id);
      if (buterIds.length == 1){
        paramsQueryCopy.butlerId = buterIds[0];
      } else {
        paramsQueryCopy.butlerId = {
          $in : buterIds
        };
      }
      result = await axios({
        method: 'GET',
        headers: { Authorization: token },
        baseURL: `${getServerProtocol()}${process.env.FEATHERS_HOST_URL}`,
        url: '/schedules',
        params: paramsQueryCopy,
        paramsSerializer: function(params) {
          return qs.stringify(params, { indices: false, encodeValuesOnly: true });
        }
      });
    }
    catch (ex) {
      if (ex.message){
        console.log(ex.message);
      } else {
        console.log(ex);
      }
      
    }
   
    const clientStructuredVisits = [];
    result.data.forEach(visit => {
      visit.anchoredVisits.forEach(realVisit => {

        if (params.user.roles.indexOf('client') > -1){
          if (realVisit.clientId == params.user.id){  //IMPORTANT< THIS IS THE PERMISSIONS LOGIC
            const reOrderedVisit = Object.assign({}, realVisit, {
              butler: visit.butler
            }, {
              butlerId: visit.butlerId
            });
            reOrderedVisit.client;
            clientStructuredVisits.push(reOrderedVisit);
          }
        }
      });
    });

    return Promise.resolve(clientStructuredVisits);
  }





  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
