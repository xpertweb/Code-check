const _ = require('lodash');
class GetButlersNearLocation {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  async find(data) {
    const state = data.query.state
    const gerButlerNearVisitQuery = this.knex
      .select([
        'srvb.butlerId as butlerId',
        'srv.id as serviceId',
        'srvad.geopoint',
        'c.id as clientId',
        'c.firstName as clientFirstName',
        'c.lastName as clientLastName',
        'c.email as clientEmail',
      ])
      .from('serviceAddresses as srvad')
      .where('srvad.state', '=', state)
      .leftJoin('services as srv', 'srvad.serviceId', 'srv.id')
      .leftJoin('clients as c', 'srv.clientId', 'c.id')
      .leftJoin('serviceButlers as srvb', 'srv.id', 'srvb.serviceId')

    let visits = await gerButlerNearVisitQuery;
    visits = _.uniqBy(visits, 'clientId')
    return visits
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
  return new GetButlersNearLocation(options);
}
module.exports.Service = GetButlersNearLocation;
