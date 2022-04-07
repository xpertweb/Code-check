const calculateScoresForButler = require('../../helpers/calculate-scores-for-butler');
const {LocalDate} = require('js-joda');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(params) {
    let result = {};

    return Promise.resolve(result);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


