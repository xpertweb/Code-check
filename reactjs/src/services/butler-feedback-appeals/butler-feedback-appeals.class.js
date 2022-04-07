const knexnest = require('knexnest');
const { LocalDate } = require('js-joda');
const { BadRequest } = require('@feathersjs/errors');
const util = require('../../helpers/util')
/* eslint-disable no-unused-vars */
class ButlerFeedbackAppeals {
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  constructor(options) {
    this.options = options || {};
  }

  async find(data, params) {
    const {roles, id} = data.user;
    const query = this.knex.select(
      'bfa.id AS _id',
      'bfa.reason as _reason',
      'bfa.dateOfCreation as _dateOfCreation',
      'bfa.description as _description',
      'bfa.butlerReason as _butlerReason',
      'bfa.status as _status',
      'b.id as _butler__id',
      'b.firstName as _butler__firstName',
      'b.lastName as _butler__lastName',
      'sfb.id as _serviceFeedback__id',
      'sfb.score as _serviceFeedback__score',
      'sfb.comment as _serviceFeedback__comment',
      'sfb.visitDate as _serviceFeedback__visitDate',
      'c.firstName as _client__firstName',
      'c.lastName as _client__lastName',
      'c.email as _client__email',
      's.id as _services__id',
      's.serviceLine as _services__serviceLine',

    ).from('butlerFeedbackAppeals as bfa')
      .leftJoin('butlers as b', 'b.id', 'bfa.butlerId')
      .leftJoin('serviceFeedback as sfb', 'sfb.id', 'bfa.feedbackId')
      .leftJoin('services as s', 's.id', 'sfb.serviceId')
      .leftJoin('clients as c', 'c.id', 's.clientId')

    if (roles.includes('butler')){
      query.where('bfa.butlerId', id);
    }
    const result = await knexnest(query)
    return result
  }

  async create(data, params) {
    const {roles} = params.user;
    const butlerId = roles.includes('butler') ? params.user.id : data.butlerId;

    const { feedbackId, butlerReason, description } = data;
    try {
      const result = await this.knex('butlerFeedbackAppeals').insert({
        butlerId,
        feedbackId,
        butlerReason,
        description,
        dateOfCreation: util.currentDate(),
        status: 'new'
      })
      return result
    } catch (error) {
      return Promise.reject(new BadRequest(error))
    }
  }

  async patch(id, data, params) {
    try {
      const record = await this.knex('butlerFeedbackAppeals').where('id', id).first();
      if (!record || util.isEmptyObj(record)) {
        return Promise.reject(util.endpointError({ id: 'invalid value' }));
      }

      if (record.status !== 'new') {
        return Promise.reject(util.endpointError({ status: 'status is already updated' }));
      }

      if (['denied', 'approved'].includes(data.status) === false) {
        return Promise.reject(util.endpointError({ status: 'invalid value' }));
      }
      const reason = data.reason ? String(data.reason) : ''
      const defaults = {
        status: data.status,
        reason,
        dateStatusChanged: util.currentDate()
      }
      await this.knex('butlerFeedbackAppeals').where({id:id}).update(defaults)
      return {result: 'success'};
    } catch (error) {
      return Promise.reject(util.endpointError(error));
    }
  }

  async remove(id, params) {
    return { id };
  }
}
module.exports = function (options) {
  return new ButlerFeedbackAppeals(options);
}
module.exports.Service = ButlerFeedbackAppeals
