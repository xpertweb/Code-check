const { BadRequest } = require('@feathersjs/errors');
const util = require('../../helpers/util');
const moment = require('moment')

const clientRescheduledVisitTemplate = require('../../mail-templates/client-rescheduled-visit-template');
const { sendEmail } = require('../../helpers/send-email');

/* eslint-disable no-unused-vars */
class VisitModificationRequests {

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  constructor(options) {
    this.options = options || {};
  }

  async find(data) {
    try {
      const clientId = data.user && data.user.id;
      const roles = data.user && data.user.roles;
      const startDate = data.query.startDate && new Date(data.query.startDate)
      const endDate = data.query.endDate && new Date(data.query.endDate)
      let query = '';
      if(roles.includes('client'))
      {
        query = this.knex('visitModificationRequests').select('id', 'visitDate', 'preferredDate', 'preferredTime', 'visitPlanId', 'visitDuration', 'status').where({clientId}).whereNot({'status': 'cancelled'}).orderBy('dateTimeCreated','desc');
      }else {
        query = this.knex
          .from('visitModificationRequests as vmr')
          .select('vmr.id as id' ,
            'vmr.visitDate as visitDate',
            'vmr.preferredDate as preferredDate',
            'vmr.preferredDateSecondary as preferredDateSecondary',
            'vmr.preferredTime as preferredTime',
            'vmr.preferredTimeSecondary as preferredTimeSecondary',
            'vmr.visitPlanId as visitPlanId',
            'vmr.serviceId as serviceId',
            'vmr.visitDuration as visitDuration',
            'vmr.status as status',
            'vmr.butlerChangeReason as butlerChangeReason',
            'vmr.modifyAllFutureVisits as modifyAllFutureVisits',
            'vmr.newButlerNeeded as newButlerNeeded',
            'vmr.clientId as clientId',
            'vmr.butlerId as butlerId',
            'clients.email as clientEmail',
            'clients.firstName as clientFirstName',
            'clients.lastName as clientLastName',
            'butlers.email as butlersEmail',
            'butlers.firstName as butlersFirstName',
            'butlers.lastName as butlersLastName',
            'vmr.dateTimeCreated as dateTimeCreated')
          .leftJoin('clients','vmr.clientId','clients.id')
          .leftJoin('butlers','vmr.butlerId','butlers.id')
          .whereNot({'vmr.status': 'cancelled'})
          .where('vmr.dateTimeCreated', '>=', startDate)
          .where('vmr.dateTimeCreated', '<', endDate)
          .orderBy('vmr.dateTimeCreated','desc');
      }
      return query.then(result => Promise.resolve(result));
    } catch (error) {
      return Promise.reject(new BadRequest(error));
    }
  }

  async create(data,params) {
    try {
      const { clientId, serviceId, visitPlanId, visitDate, preferredDate = null, preferredDateSecondary = null,
        preferredTime = null, preferredTimeSecondary = null, visitDuration = null, butlerId,
        butlerChangeReason = null, modifyAllFutureVisits, status, dateTimeCreated = new Date(), newButlerNeeded = false} = data;

      const dbResponse =  await this.knex('visitModificationRequests').insert({
        clientId,
        serviceId,
        visitPlanId,
        visitDate,
        preferredDate,
        preferredDateSecondary,
        preferredTime,
        preferredTimeSecondary,
        visitDuration,
        butlerId,
        butlerChangeReason,
        modifyAllFutureVisits,
        status,
        dateTimeCreated,
        newButlerNeeded
      });
      //now notify the support team about this
      if (params.fullUserDetails){
        const notificationText = clientRescheduledVisitTemplate
        .replace(/@client_name@/g, `${params.fullUserDetails.firstName}`)
        .replace(/@client_email@/g, params.fullUserDetails.email)
        .replace(/@domain_name@/g,(process.env.NODE_ENV === 'development' ? 'blue-ops.jarvistest.com' : 'ops.getjarvis.com.au'))
        .replace(/@visit_date@/g, visitDate)

        console.log(notificationText);
        const email = {
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to: process.env.HELP_NOTIFICATION_EMAIL_ADDRESS,
          subject: 'Client Reschedule Visit Request - Automatic Notification',
          html: notificationText,
        };
        sendEmail(this.app, email);
      }

      return dbResponse;
    } catch (error) {
      return Promise.reject(new BadRequest(error));
    }
  }

  async patch(id, data) {
    try {
      const record = await this.knex('visitModificationRequests').where({id}).first();
      if (!record || util.isEmptyObj(record))
        return Promise.reject(util.endpointError({id: 'invalid value'}));

      if (record.status !== 'pending')
        return Promise.reject(util.endpointError({status: 'status is already updated'}));

      if (['denied', 'approved', 'cancelled'].includes(data.status) === false)
        return Promise.reject(util.endpointError({status: 'invalid value'}));

      await this.knex('visitModificationRequests').where({id}).update({status: data.status});
      return {result: 'successfully updated.'};
    } catch (error) {
      return Promise.reject(util.endpointError(error));
    }
  }

  async remove(id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new VisitModificationRequests(options);
};

module.exports.Service = VisitModificationRequests;
