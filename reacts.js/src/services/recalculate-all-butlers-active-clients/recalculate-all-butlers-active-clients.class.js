const calculateActiveClients = require('../../helpers/calculate-active-clients');
// const calculateActiveClientsSlow = require('../../helpers/calculate-active-clients-for-list-of-butlers');
const _ = require('lodash');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async create(data, params) {
    // await calculateActiveClientsSlow(
    //   null,
    //   this.app,
    //   this.knex
    // );

    await calculateActiveClients(this.knex, _.get(params, 'headers.authorization'));
    return Promise.resolve({ data: [] });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
