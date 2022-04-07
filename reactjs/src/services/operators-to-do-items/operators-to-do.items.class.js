const { BadRequest } = require('@feathersjs/errors');
const moment = require('moment')
const _ = require('lodash');
class operatorsToDoItems {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data) {
    try {
      let result =  await this.knex('operatorsToDoItems').insert(data);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(new BadRequest(error));
    }
  }

  async update(id, data, params) {
    try {
      const result =  await this.knex('operatorsToDoItems').where('id',id).update({description:data.description,operatorId: data.operatorId, taskTime: data.taskTime, taskTimezone:data.taskTimezone,status:data.status});
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(new BadRequest(error));
    }
  }

  async patch(id, data, params) {
    try {
      const result =  await this.knex('operatorsToDoItems').where('id',id).update({description:data.description,operatorId: data.operatorId, taskTime: data.taskTime, taskTimezone:data.taskTimezone,status:data.status});
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(new BadRequest(error));
    }
  }
  async find(params) {
    let query = '';
    try {
      query = this.knex('operatorsToDoItems').where('operatorId', params.query.operatorId).where('createdDateTime','>=',moment().format('YYYY-MM-DD')).where('createdDateTime','<',moment().add(1, 'days').format('YYYY-MM-DD')).orderBy('taskTime','asc');
      return query.then(result => Promise.resolve(result));
    } catch (error) {
      return Promise.reject(new BadRequest(error));
    }
  }
  async remove(params) {
    try {
      const operatorsToDoItems = await this.knex('operatorsToDoItems').whereIn('id', params.split(',')).del();
      return operatorsToDoItems;
    } catch (error) {
      return Promise.reject(new BadRequest(error));
    }
  }
}

module.exports = function (options) {
  return new operatorsToDoItems(options);
};

module.exports.Service = operatorsToDoItems;
