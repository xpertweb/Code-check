const knexnest = require('knexnest');
const { LocalDate } = require('js-joda');
const { BadRequest } = require('@feathersjs/errors');
const util = require('../../helpers/util')
const _ = require('lodash');
const { service } = require('@feathersjs/authentication');

/* eslint-disable no-unused-vars */


class Services {
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const {perPage, currentPage } = params.query;
    const servicesQuery = this.createSearchQuery(params);

    const resultsQuery = this.knex()
      .select('search_results_count.total', 'search_results.*')
      .from(this.knex.raw('search_results, search_results_count'));

    const _currentPage = Number(currentPage) + 1;
    const _perPage = Number(perPage);

    resultsQuery.limit(_perPage);
    if (_currentPage > 1){
      resultsQuery.offset(_currentPage * _perPage);
    }

    const query = `
      WITH search_results as (${servicesQuery}),
      search_results_count as (select count(search_results.id) total from "search_results")
      ${resultsQuery}
    `;

    const resp = await this.knex.raw(query);
    const results =  _.get(resp, 'rows', []);

    return {
      dataCount:_.get(_.first(results), 'total', 0),
      data: results
    };
  }

  createSearchQuery(params){
    const localTable = 'services';
    const { joinInstant, searchString } = params.query;
    const queryString = this.prepareSearchQueryForFTS(searchString);

    const opt = {
      type: 'temporalJoin',
      with: 'butlers',
      through: 'serviceButlers',
      localId: 'id',
      throughForeignId: 'serviceId',
      throughLocalId: 'butlerId',
      foreignId: 'id',
      asPrefix: 'butler',
      select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'activeClients'],
      instantField: 'activeFrom'
    };

    const servicesQuery = this.knex
      .select([
        this.knex.raw('DISTINCT ON (services.id) services.id as "servicesId"'),
        'services.*',
        'client.id as clientId',
        'client.firstName as clientFirstName',
        'client.lastName as clientLastName',
        'client.phoneNumber as clientPhoneNumber',
        'client.email as clientEmail',
        'srvAddr.id as addressId',
        'srvAddr.line1 as addressLine1',
        'srvAddr.line2 as addressLine2',
        'srvAddr.locale as addressLocale',
        'srvAddr.state as addressState',
        'srvAddr.postcode as addressPostcode',
        'srvAddr.country as addressCountry'
      ])
      .from("services")
      .leftJoin("clients as client", "services.clientId", "client.id")
      .leftJoin("serviceAddresses as srvAddr", "services.id", "srvAddr.serviceId")
      .where(`srvAddr.activeFrom`, '<=', joinInstant || new Date())
      .leftJoin(function () {
        this
          .select([
            `${opt.through}.${opt.throughForeignId} as ${opt.throughForeignId}`,
            `${opt.through}.${opt.instantField} as ${opt.instantField}`,
            `${opt.with}.*`
          ])
          .from(opt.through)
          .leftJoin(opt.with, `${opt.with}.${opt.foreignId}`, `${opt.through}.${opt.throughLocalId}`)
          .where(`${opt.through}.${opt.instantField}`, '<=', joinInstant || new Date())
          .as(opt.asPrefix)
          .orderBy(`${opt.through}.${opt.instantField}`, 'desc');
      }, `${opt.asPrefix}.${opt.throughForeignId}`, `${localTable}.${opt.localId}`)
      .select(opt.select.map(field => `${opt.asPrefix}.${field} as ${opt.asPrefix}${field.charAt(0).toUpperCase() + field.slice(1)}`));

    if (queryString) {
      servicesQuery.where(this.knex.raw(`to_tsvector(
          coalesce("client"."firstName", '') || ' ' ||
          coalesce("client"."lastName", '') || ' ' ||
          replace(coalesce("client"."phoneNumber", ''), '+61', '') || ' ' ||
          coalesce("butler"."firstName", '') || ' ' ||
          coalesce("butler"."lastName", '') || ' ' ||
          replace(coalesce("butler"."phoneNumber", ''), '+61', '') || ' ' ||
          coalesce("srvAddr"."line1", '') || ' ' ||
          coalesce("srvAddr"."line2", '') || ' ' ||
          coalesce("srvAddr"."locale", '') || ' ' ||
          coalesce("srvAddr"."state", '') || ' ' ||
          coalesce("srvAddr"."postcode", '') || ' ' ||
          coalesce("srvAddr"."country", '') || ' ' ||
          replace(replace(coalesce("client"."email", ''), '@', 'AT'), '.', 'DOT') || ' ' ||
          replace(replace(coalesce("butler"."email", ''), '@', 'AT'), '.', 'DOT')
        ) @@ to_tsquery('${queryString}')`));
    }

    return servicesQuery;
  }

  prepareSearchQueryForFTS(_searchQuery){
    const safeQuery = this.removeUnsafeCharsFromSearchQuery((_searchQuery || '').trim());
    const searchQuery = this.removePhonePrefix(safeQuery);
    if (!searchQuery){
      return '';
    }

    return searchQuery.split(' ').map(item => {
      return item
        .replace(new RegExp('@', 'g'), 'AT')
        .replace(new RegExp('\\.', 'g'), 'DOT');
    }).join('&')  + ':*';
  }

  removePhonePrefix(searchQuery){
    const phonePrefix = '+61';
    if (searchQuery.startsWith(phonePrefix)){
      return searchQuery.slice(phonePrefix.length);
    }
    return searchQuery;
  }
  modifyTerm(term){
    return term.split(',').map(t => t.trim()).join(' ');
  }

  removeUnsafeCharsFromSearchQuery(term){
  	term= this.modifyTerm(term);
    const charsToDiscard = new Set('!"#$%&\'()*,:;<=>?[\\]^`{|}~'.split(''));
    let ret = '';
    for (const char of term) {
      if (charsToDiscard.has(char)){
        continue;
      }
      ret = ret + char;
    }

    return ret;
  }


  get(params) {
    return null;
  }

  create(data, params) {
    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }

}

module.exports = function (options) {
  return new Services(options);
}
module.exports.Service = Services;
