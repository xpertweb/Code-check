const { Service } = require('feathers-knex');

exports.AllocationCancellation = class AllocationCancellation extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'allocationCancellation'
    });
  }
};
