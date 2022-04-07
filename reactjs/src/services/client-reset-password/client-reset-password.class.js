const util = require('../../helpers/util')
const hash = require("@feathersjs/authentication-local/lib/utils/hash");
const { BadRequest } = require('@feathersjs/errors');

/* eslint-disable no-unused-vars */
class ClientResetPassword {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  find(data) {
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

  async patch(id, data) {
    try {
      let passwordHased = await hash(data.password);
      if(passwordHased) {
        await this.knex('clients').where('id', id).update({password: passwordHased});
        return Promise.resolve({id: id, message: "Successfully updated password"})
      } else {
        return Promise.reject(new BadRequest('Failed to update password'))
      }
    } catch (error) {
      return Promise.reject(util.endpointError(error));
    }
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
};

module.exports = function (options) {
  return new ClientResetPassword(options);
}
module.exports.Service = ClientResetPassword;
