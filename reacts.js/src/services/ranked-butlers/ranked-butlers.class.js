
const getButlerRankedList = require('./logic/get-butler-ranked-list');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const { butlersNeedingManagement } = params;

    const result = getButlerRankedList(butlersNeedingManagement );
    
    return Promise.resolve(result);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
