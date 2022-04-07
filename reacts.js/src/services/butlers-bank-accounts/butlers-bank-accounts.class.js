
const _ = require('lodash');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
   
    let allButlers = await this.app
      .service('butlers')
      .find();

    let allButlerBankDetails = await this.app
      .service('butlerBankDetails')
      .find();

    return Promise.resolve(allButlerBankDetails.map(x=> {
      return {
        butlerId : x.butlerId,
        butlerEmail : (allButlers.find(z=> z.id == x.butlerId)).email,
        bankAccountNumber : x.bankAccountNumber,
        bankBsbNumber: x.bankBsbNumber,
        lastModifiedDateTime:x.lastModifiedDateTime
      };
    }))
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
