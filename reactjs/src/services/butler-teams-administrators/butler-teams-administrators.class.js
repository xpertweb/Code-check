const { Service } = require('feathers-knex');

exports.ButlerTeamsAdministrators = class ButlerTeamsAdministrators extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'butlerTeamsAdministrators'
    });
  }
};
