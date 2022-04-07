
const _ = require('lodash');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');

  }

  async find(params) {

    if (params.query.clientId){
      if (Array.isArray(params.query.clientId)){
        throw new Error ('You cannot specify multiple ids or you may run into a http header limit');
      }
    }
   

    let query = this.knex
      .from('serviceInvoicing')
      .select([
        'services.clientId as clientId',
        'serviceInvoicing.requiresTaxInvoice as requiresTaxInvoice'
      ])
      .leftJoin(
        'services',
        'serviceInvoicing.serviceId',
        'services.id'
      );
    if (params.query.clientId){
      query.andWhere('services.clientId','=',params.query.clientId);
    }

    const serviceInvoicingData = await query;
    const servicesOrganizedByClient = _.groupBy(serviceInvoicingData, 'clientId');

    return Promise.resolve(servicesOrganizedByClient);
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
