const { LocalDate } = require("js-joda");

/* eslint-disable no-unused-vars */
class ClientActiveButlers {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  async find(hook) {
    const {id} = hook.user;
    const clientActiveButlersQuery = this.knex
      .select([
        'bt.id as butlerId',
        'srv.id as serviceId',
        'bt.firstName as butlerFirstName',
        'bt.lastName as butlerLastName',
        'bt.phoneNumber as butlerPhoneNumber',
        'bt.email as butlerEmail'
      ])
      .from('services as srv')
      .where('srv.clientId', '=', id)
      .andWhere(function() {
        this.where('srv.lastVisitDate', '>=', new Date()).orWhere('srv.lastVisitDate', null)
      })
      .andWhere('srvb.activeFrom', '<=', new Date())
      .leftJoin('serviceButlers as srvb', 'srv.id', 'srvb.serviceId')
      .leftJoin('butlers as bt', 'srvb.butlerId', 'bt.id')
      .orderBy('srvb.activeFrom', 'desc');
    const result = await clientActiveButlersQuery;
    const tempServiceIds = [];
    const filteredButlers = [];
    await result.forEach(butler => {
      if(butler.serviceId &&  tempServiceIds.indexOf(butler.serviceId) < 0 && butler.butlerFirstName.toLowerCase() !== 'allocate'){
        filteredButlers.push(butler);
        tempServiceIds.push(butler.serviceId);
      }
    })
    return filteredButlers;
  }

  get(id, params) {
    return Promise.resolve(id);
  }

  create(data, params) {
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
  return new ClientActiveButlers(options);
}
module.exports.Service = ClientActiveButlers;
