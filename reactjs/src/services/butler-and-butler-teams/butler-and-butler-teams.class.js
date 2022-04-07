const { Service } = require('feathers-knex');

exports.ButlerAndButlerTeams = class ButlerAndButlerTeams extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'butlerAndButlerTeams'
    });
  }
};
