/* eslint-disable no-unused-vars */
class NotifyNearByButlers {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  find(data, params) {
    return Promise.resolve(data);
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
  return new NotifyNearByButlers(options);
}
module.exports.Service = NotifyNearByButlers;
