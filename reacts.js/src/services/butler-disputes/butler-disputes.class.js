const knexnest = require('knexnest');
const { LocalDate } = require('js-joda');
const { BadRequest } = require('@feathersjs/errors');
const util = require('../../helpers/util')
const _ = require('lodash');
/* eslint-disable no-unused-vars */


class ButlerDisputes {
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  constructor(options) {
    this.options = options || {};
  }

  async get(_, params) {
    const {id} = params.user || {};

    const butlerDisputeGetQuery = this.knex
      .from("butlerDisputes")
      .where('opsButlerId', id)
      .select(['butlerDisputes.id as id',
        'butlerDisputes.approvalStatus as approvalStatus',
        'butlerDisputes.approvalReason as approvalReason',
        'butlerDisputes.historicVisitId as historicVisitId',
        'butlerDisputes.disputeReason as disputeReason',
        'butlerDisputes.disputeQuesAns as disputeQuesAns',
        'butlerDisputes.opsClientId as opsClientId',
        'butlerDisputes.dateOfCreation as dateOfCreation',
        'butlerDisputes.dateOfModification as dateOfModification',
        'clients.firstName as clientFirstName',
        'clients.lastName as clientLastName',
      ])
      .leftJoin("clients", "butlerDisputes.opsClientId", "clients.id");
    const result = await butlerDisputeGetQuery;
    return result;
  }


  async find(params) {
    const butlerDisputeFindQuery = this.knex
      .from("butlerDisputes")
      .select(['butlerDisputes.id as id',
        'butlerDisputes.approvalStatus as approvalStatus',
        'butlerDisputes.approvalReason as approvalReason',
        'butlerDisputes.historicVisitId as historicVisitId',
        'butlerDisputes.disputeReason as disputeReason',
        'butlerDisputes.disputeQuesAns as disputeQuesAns',
        'butlerDisputes.snapShotUrl as snapShotUrl',
        'butlerDisputes.visitWasNotRecorded as visitWasNotRecorded',
        'butlerDisputes.dateOfCreation as dateOfCreation',
        'butlerDisputes.dateOfModification as dateOfModification',
        'butlerDisputes.opsClientId as opsClientId',
        'clients.firstName as clientFirstName',
        'clients.lastName as clientLastName',
        'butlerDisputes.opsButlerId as opsButlerId',
        'butlers.firstName as butlerFirstName',
        'butlers.lastName as butlerLastName',
      ])
      .leftJoin("clients", "butlerDisputes.opsClientId", "clients.id")
      .leftJoin("butlers", "butlerDisputes.opsButlerId", "butlers.id");
    const result = await butlerDisputeFindQuery;
    return result;
  }

  async create(data, params) {
    const {
      historicVisitId,
      butlerEmail,
      clientEmail,
      visitWasNotRecorded,
      disputeReason,
      disputeQuesAns,
      snapShotFile
    } = data;
    try {
      const clientsResp = await this.knex('clients').where('email', clientEmail).first();
      const butlersResp = await this.knex('butlers').where('email', butlerEmail).first();
      let disputeSnapShotUrl;
      try {
        if (snapShotFile) {
          const blob = { uri: snapShotFile };
          const fileUploaderResp = await this.app.service('fileUploader').create(blob);
          if (fileUploaderResp && fileUploaderResp.id) {
            disputeSnapShotUrl = `${process.env.AWS_S3_URL}/${process.env.AWS_IMAGES_S3_BUCKET}/${fileUploaderResp.id}`;
          }
        }
      } catch (error) {
        console.log('error in Dispue Snapshot uploading ', error)
      }

      const result = await this.knex('butlerDisputes').insert({
        historicVisitId: historicVisitId,
        opsButlerId: butlersResp.id,
        opsClientId: clientsResp && clientsResp.id || null,
        dateOfCreation: util.dateTime(),
        visitWasNotRecorded: visitWasNotRecorded,
        dateOfModification: null,
        disputeReason: disputeReason,
        disputeQuesAns: disputeQuesAns,
        snapShotUrl: disputeSnapShotUrl || 'N/A',
        approvalStatus: 'new'
      });
      return result;
    } catch (error) {
      return Promise.reject(new BadRequest(error))
    }
  }

  async patch(id, data, params) {
    try {
      const record = await this.knex('butlerDisputes').where('id', id).first();
      if (!record || util.isEmptyObj(record)) {
        return Promise.reject(util.endpointError({ id: 'invalid value' }));
      }

      if (record.approvalStatus !== 'new') {
        return Promise.reject(util.endpointError({ Error: 'status is already updated' }));
      }

      const approvalReason = data.approvalReason ? String(data.approvalReason) : ''
      const dataToBeUpadted = {
        approvalStatus: data.approvalStatus,
        approvalReason,
        dateOfModification: util.dateTime()
      }
      await this.knex('butlerDisputes').where({ id: id }).update(dataToBeUpadted)
      return { result: 'success' };
    } catch (error) {
      return Promise.reject(util.endpointError(error));
    }
  }

  async remove(id, params) {
    return { id };
  }
};
module.exports = function (options) {
  return new ButlerDisputes(options);
}
module.exports.Service = ButlerDisputes
