const { Service } = require('feathers-knex');

exports.ServiceLogs = class ServiceLogs extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'serviceLogs'
    });
  }
};
