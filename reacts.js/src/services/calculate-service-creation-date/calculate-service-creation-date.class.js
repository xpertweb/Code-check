const calculateLastVisit = require('../visit-plans/hooks/calculate-last-visit-fn');
const _ = require('lodash');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const code = _.get(params, 'query.executionCode');
    if (code !== 'fn2020'){
      return {
        error: 'invalid execution code...'
      };
    }

    const knex = this.app.get('knexClient');
    const services = await knex
      .select('id')
      .from('services')

    return Promise.all(services.map(s => calculateLastVisit(this.app, s.id)));
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
