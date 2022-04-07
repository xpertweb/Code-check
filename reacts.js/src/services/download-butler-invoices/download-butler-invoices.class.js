const _ = require('lodash');
const { getSingleHistoricVisitFromPayment } = require('../../helpers/get-historic-visit-from-payments-platform');
const templateButlerToClient = require('./templates/invoice-butler-to-client');
const templateJarvisToButler = require('./templates/invoice-Backend-to-butler');
const winston = require('winston');
const getServerProtocol = require('../../helpers/get-server-protocol');
const axios = require('axios');


const {
  ok,
  err,
  mockVisitData,
  getAmount,
  randomStringGenerator,
  getInvoice,
  createPDF,
  genPaymentList,
  fmtButlerAddress,
  fmtDescription,
  fmtClientAddress,
  formatDate
} = require('./helper');



class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(params) {
    const invoiceId = randomStringGenerator();
    const visitDate = _.get(params.query, 'visitDate');
    const visitPlanId = _.get(params.query, 'visitPlanId');
    const invoiceType = _.get(params.query, 'invoiceType');

    const service = await this.getServiceInfo(visitPlanId);
    if (!service){
      return err({error: 'Invalid service id'});
    }

    const authorization = await this.getOpsToken();
    const visit = await this.getVisit(service.clientEmail, authorization, visitDate);
    if (!visit) {
      return {status: 'error', response: {error: 'Unable to find visit'}};
    }

    if (!_.get(visit, 'fee.amount')){
      return err({error: 'No fee record found.'});
    }

    // mock visit
    // const visit = mockVisitData(visitDate);

    if (invoiceType === 'butler-to-client'){
      const data = await this.clientInvoiceData(invoiceId, service.id, visit);
      const clientPdf = await this.createClientInvoice(data);
      return ok(clientPdf);
    }

    if (invoiceType === 'Backend-to-butler'){
      // Backend to butler
      const data = await this.butlerInvoiceData(invoiceId, visit);
      const butlerPdf = await this.createButlerInvoice(data);
      return ok(butlerPdf);
    }

    return err({error: 'invalid invoice type.'});
  }

  /**
   * Client invoice
   * */
  async clientInvoiceData(invoiceId, serviceId, visit){
    const {butler, client} = visit || {};
    const date = _.get(visit, 'date') || '';
    const amount = getAmount(_.get(visit, 'charge')) / 100;


    // get the butler abn and phone number
    const butlerInfo = await this.getButlerByEmail(butler.email);
    const serviceAddress = await this.getServiceAddress(serviceId);
    const invoiceDate = formatDate(date);

    return {
      from:{
        name: `${butler.firstName} ${butler.lastName}`,
        email: butler.email,
        address: fmtButlerAddress(butlerInfo),
        abn: _.get(butlerInfo, 'abnNumber') || 'N/A'
      },
      to: {
        firstName: client.firstName,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
        address: fmtClientAddress(serviceAddress),
      },
      invoice:{
        date: invoiceDate,
        number: invoiceId,
        fees: 0,
        amount: amount,
      },
      htmlPaymentList: genPaymentList(invoiceDate, fmtDescription(visit), amount),
    };
  }

  createClientInvoice(data){
    const html = templateButlerToClient
      .replace(/@@toName@@/g, data.to.name)
      .replace(/@@invoiceDate@@/g, data.invoice.date)
      .replace(/@@toEmail@@/g, data.to.email)
      .replace(/@@toAddress@@/g, data.to.address)
      .replace(/@@fromName@@/g, data.from.name)
      .replace(/@@fromEmail@@/g, data.from.email)
      .replace(/@@fromAddress@@/g, data.from.address)
      .replace(/@@fromABN@@/g, data.from.abn)
      .replace(/@@fees@@/g, data.invoice.fees)
      .replace(/@@htmlPaymentList@@/g, data.htmlPaymentList)
      .replace(/@@totalAmount@@/g, data.invoice.amount)
      .replace(/@@invoiceNumber@@/g, data.invoice.number);

    return createPDF(html);
  }

  /**
   * Butler invoice
   * */
  async butlerInvoiceData(invoiceId, visit){
    const {butler} = visit || {};
    const date = _.get(visit, 'date') || '';
    const amount = _.get(visit, 'fee.amount') / 100;
    const invoiceDate = formatDate(date);

    // get the butler abn and phone number
    const butlerInfo = await this.getButlerByEmail(butler.email);
    const description = _.get(visit, 'fee.description') || 'N/A';

    return {
      to: {
        name: `${butler.firstName} ${butler.lastName}`,
        email: butler.email,
        address: fmtButlerAddress(butlerInfo),
        abn: _.get(butlerInfo, 'abnNumber') || 'N/A'
      },
      invoice:{
        date: invoiceDate,
        number: invoiceId,
        fees: 0,
        amount: amount,
      },
      htmlPaymentList: genPaymentList(invoiceDate, description, amount),
    };
  }

  createButlerInvoice(data){
    const html = templateJarvisToButler
      .replace(/@@toName@@/g, data.to.name)
      .replace(/@@invoiceDate@@/g, data.invoice.date)
      .replace(/@@toEmail@@/g, data.to.email)
      .replace(/@@toAddress@@/g, data.to.address)
      .replace(/@@fees@@/g, data.invoice.fees)
      .replace(/@@htmlPaymentList@@/g, data.htmlPaymentList)
      .replace(/@@totalAmount@@/g, data.invoice.amount)
      .replace(/@@invoiceNumber@@/g, data.invoice.number);

    return createPDF(html);
  }

  /**
   * Helper
   * */
  async getVisit(email, authorization, visitDate){
    const visit = await getSingleHistoricVisitFromPayment(email, authorization, visitDate);
    return _.first(visit);
  }

  async getServiceAddress(serviceId){
    const address = await this.app.service('serviceAddresses').find({
      query: { serviceId }
    });
    return _.first(address);
  }

  async getButlerByEmail(email){
    const butler = await this.app.service('butlers').find({
      query: { email }
    });
    return _.first(butler);
  }

  async getServiceInfo(visitPlanId){
    const resp = await this.knex('visitPlans')
      .select('serviceId as id', 'clients.email as clientEmail')
      .where('visitPlans.id', visitPlanId)
      .leftJoin('services', 'services.id', 'visitPlans.serviceId')
      .leftJoin('clients', 'clients.id', 'services.clientId');

    return _.first(resp);
  }

  async getOpsToken(){
    const payload = {
      method: 'POST',
      baseURL: `${getServerProtocol()}${process.env.FEATHERS_HOST_URL}`,
      url: '/authentication',
      data: {
        email: process.env.ROOT_EMAIL,
        password: process.env.ROOT_PASSWORD,
        strategy: 'operatorLocal'
      }
    };

    const resp = await axios(payload);
    return _.get(resp, 'data.accessToken');
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
