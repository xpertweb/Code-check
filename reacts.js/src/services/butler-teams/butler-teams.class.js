const { Service } = require('feathers-knex');

exports.ButlerTeams = class ButlerTeams extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'butlerTeams'
    });
  }
};
