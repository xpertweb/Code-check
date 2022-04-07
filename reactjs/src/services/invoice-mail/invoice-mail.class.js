const { getSingleHistoricVisitFromPayment } = require('../../helpers/get-historic-visit-from-payments-platform');
const { createInvoice } = require('../../helpers/generate-invoice-pdf');
let invoiceEmailTemplate = require('../../mail-templates/invoice-email-template');
let invoiceRecordEmailTemplate = require('../../mail-templates/invoice-recorded-email-template');
let invoiceRecordEmailTemplateForThirdParty = require('../../mail-templates/invoice-recorded-email-template-for-third-party');
const {sendEmailWithAttachments} = require('../../helpers/send-email');
const { BadRequest } = require('@feathersjs/errors');
const moment = require('moment');
const _ = require('lodash');


const randomStringGenerator = ()=>{
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(params) {
    return this.sendInvoice({
      serviceId: _.get(params, 'query.serviceId'),
      date: _.get(params, 'query.date'),
      skipInvoiceCheck: _.get(params, 'query.skipInvoiceCheck', false),
      authorization: _.get(params, 'headers.authorization')
    });
  }

  async get(id, params) {
    return this.sendInvoice({
      serviceId: id,
      date: _.get(params, 'query.date'),
      skipInvoiceCheck: _.get(params, 'query.skipInvoiceCheck', false),
      authorization: _.get(params, 'headers.authorization')
    });
  }

  async sendInvoice(options){
    const serviceId = options.serviceId;
    const visitDate = options.date;
    const authorization = options.authorization;
    const invoiceId = randomStringGenerator();

    if (!serviceId){
      return new BadRequest('Bad Request', {error: 'Invalid service id'});
    }

    try {
      const invoice = _.first(await this.queryInvoice(serviceId, options));
      if (!invoice) {
        return new BadRequest('Bad Request', {error: 'Unable to find invoice'});
      }

      const visit = _.first(await getSingleHistoricVisitFromPayment(invoice.clientEmail, authorization, visitDate));
      if (!visit) {
        return new BadRequest('Bad Request', {error: 'Unable to find visit'});
      }

      // mock visit
      // const visit = this.mockVisitData(options);

      const {
        client: {
          firstName: clientFirstName = '',
          lastName: clientLastName = '',
          email: clientEmail = '',
          phoneNumber: clientPhoneNumber = ''
        } = {},
        butler: {
          firstName: butlerFirstName = '',
          lastName: butlerLastName = '',
          email: butlerEmail = ''
        } = {},
      } = visit;

      const date = _.get(visit, 'date') || '';
      const amount = this.getAmount(_.get(visit, 'charge')) / 100;

      let visitAlreadyPaidMsg = '';

      if(amount == 0){
         invoiceEmailTemplate = require('../../mail-templates/invoice-email-template-for-zero-amount');
         visitAlreadyPaidMsg = '<span style="color:green;margin-right:5px">(Visit already paid)</span>';
      }


      // get the butler abn and phone number
      const butler = _.first(await this.app.service('butlers').find({ query: { email: butlerEmail } }));
      const address = _.first(await this.app.service('serviceAddresses').find({ query: { serviceId: serviceId } }));
      const invoiceDate = moment(date, 'YYYY-MM-DDThh:mm:ss.sssZ').format('YYYY-MM-DD');

      const htmlPaymentList = `<tr class="details">
          <td>1</td>
          <td>${invoiceDate}</td>
          <td>${this.fmtDescription(invoice, visit)}</td>
          <td>${visitAlreadyPaidMsg}$${amount}</td>
        </tr>`;

      const pdfData = await createInvoice({
        client_fName: clientFirstName,
        client_name: _.get(invoice, 'recipientName') || `${clientFirstName} ${clientLastName}`,
        invoice_date: invoiceDate,
        invoice_number: invoiceId,
        client_email: _.get(invoice, 'recipientEmail') || clientEmail,
        client_address: this.fmtClientAddress(invoice, address),
        butler_name: `${butlerFirstName} ${butlerLastName}`,
        butler_email: butlerEmail,
        htmlPaymentList: htmlPaymentList,
        butler_address: this.fmtButlerAddress(butler),
        ABN: _.get(butler, 'abnNumber') || 'N/A',
        fees: amount,
        total_amount: amount
      });

      // to view the pdf
      // require('fs').writeFileSync('zzz.pdf', pdfData, 'binary');

      const emailForClient = {
        from: process.env.NO_REPLY_EMAIL_ADDRESS,
        to: process.env.NODE_ENV === 'development'
        ? 'test@getjarvis.com.au'
        : clientEmail,
        subject: `Backend invoice for visit with ${butlerFirstName}`,
        html:invoiceEmailTemplate
          .replace(/@@payment_link@@/g, this.getPaymentLinks(visit))
          .replace(/@@client_first_name@@/g, clientFirstName),
        attachments: [{
          filename: `${invoiceDate}_invoice.pdf`,
          content: pdfData,
        }]
      };

      const emailForRecordKeeping = {
        from: process.env.NO_REPLY_EMAIL_ADDRESS,
        to:'invoice_record@getjarvis.com.au',
        subject: 'Invoice Recorded',
        html: (invoiceRecordEmailTemplate.replace(/@@client_first_name@@/g, clientFirstName)
          .replace(/@@client_last_name@@/g, clientLastName)
          .replace(/@@client_email@@/g, clientEmail)
          .replace(/@@client_phone@@/g, clientPhoneNumber)
          .replace(/@@invoiceId@@/g, invoiceId)
          .replace(/@@Date@@/g, invoiceDate)
          .replace(/@@value@@/g, amount)),
        attachments: [{
          filename: `${invoiceDate}_invoice.pdf`,
          content: pdfData,
        }]
      };



      if (invoice.recipientEmail && invoice.recipientEmail != invoice.clientEmail){
        //only send invoices when the email of the third party is different than the main party
        const emailForThirdParty = {
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to:invoice.recipientEmail,
          subject: `Backend invoice for visit with ${butlerFirstName}`,
          html: invoiceEmailTemplate.replace(/@@payment_link@@/g, this.getPaymentLinks(visit))
            .replace(/@@client_first_name@@/g, (invoice.recipientName ? invoice.recipientName : clientFirstName))
            .replace(/@@extra_line@@/g, ''),
          attachments: [{
            filename: `${invoiceDate}_invoice.pdf`,
            content: pdfData,
          }]
        };

        emailForClient.html = emailForClient.html.replace(/@@extra_line@@/g,`You are being copied to let know that we sent this to ${invoice.recipientName || 'the address you provided as primary for invoicing'}, at ${invoice.recipientEmail}, thank you for understanding:<br><br>`);

        await sendEmailWithAttachments(emailForThirdParty);
        
        // sending email for record keeping
        
        const emailForRecordKeepingForThirdParty = {
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to:'invoice_record@getjarvis.com.au',
          subject: 'Invoice recorded for third party',
          html: (invoiceRecordEmailTemplateForThirdParty.replace(/@@client_first_name@@/g, clientFirstName)
            .replace(/@@client_last_name@@/g, clientLastName)
            .replace(/@@client_primary_email@@/g, invoice.clientEmail)
            .replace(/@@client_secondary_email@@/g, invoice.recipientEmail)
            .replace(/@@client_phone@@/g, clientPhoneNumber)
            .replace(/@@invoiceId@@/g, invoiceId)
            .replace(/@@Date@@/g, invoiceDate)
            .replace(/@@value@@/g, amount)),
          attachments: [{
            filename: `${invoiceDate}_invoice.pdf`,
            content: pdfData,
          }]
        };
        
      await sendEmailWithAttachments(emailForRecordKeepingForThirdParty);

      } else {
        emailForClient.html = emailForClient.html.replace(/@@extra_line@@/g, '');
      }

      await sendEmailWithAttachments(emailForClient);
      await sendEmailWithAttachments(emailForRecordKeeping);

      console.log('email sent to ', clientEmail);
      return Promise.resolve({message: 'Mail Sent!!'});
    } catch (error) {
      console.log('Something went wrong',error);
      return new BadRequest('Bad Request', {error: error.message});
    }
  }

  async queryInvoice(serviceId, options){
    const cond = options.skipInvoiceCheck
      ? {serviceId: serviceId}
      : {requiresTaxInvoice: true, serviceId: serviceId};

    const invoiceQuery = this.knex
      .from('serviceInvoicing')
      .where(cond)
      .select([
        'services.clientId as clientId',
        'services.id as serviceID',
        'serviceInvoicing.recipientName as recipientName',
        'serviceInvoicing.recipientEmail as recipientEmail',
        'serviceInvoicing.requiresTaxInvoice as requiresTaxInvoice',
        'serviceInvoicing.description as description',
        'serviceInvoicing.recipientNumber as recipientNumber',
        'serviceInvoicing.paymentMethod as paymentMethod',
        'serviceInvoicing.frequency as frequency',
        'clients.email as clientEmail',
        'clients.firstName as clientFirstName',
        'clients.lastName as clientLastName',
        'clients.phoneNumber as clientPhoneNumber',
        'serviceInvoicing.customAddress as customAddress',
        'serviceInvoicing.customState as customState',
        'serviceInvoicing.customPostcode as customPostcode'
      ])
      .leftJoin('services', 'serviceInvoicing.serviceId', 'services.id')
      .rightJoin('clients', 'services.clientId', 'clients.id');

    return await invoiceQuery;
  }


  fmtButlerAddress(butler){
    const line1 = _.get(butler, 'address.line1') || '';
    const line2 = _.get(butler, 'address.line2') || '';
    const locale = _.get(butler, 'address.locale') || '';
    const state = _.get(butler, 'address.state') || '';
    const postcode = _.get(butler, 'address.postcode') || '';

    return `${this.concatAddressLines(line1, line2)} ${locale} ${state} ${postcode}`;
  }

  fmtDescription(invoice, visit){
    const visitDescription = _.get(visit, 'charge.description');
    const invoiceDescription = _.get(invoice, 'description');

    if (invoiceDescription && visitDescription){
      return `${invoiceDescription} - ${visitDescription}`;
    }

    // use first truthy value
    return visitDescription || invoiceDescription || 'N/A';
  }

  fmtClientAddress(invoice, address){
    const streetAddress = invoice && invoice.customAddress ? invoice.customAddress
      : `${address.line1 || ''}, ${address.line2|| ''} ${address.locale || ''}`;
    const customState = invoice && invoice.customState ? invoice.customState
      : `${address.state || ''}`;
    const customPostcode = invoice && invoice.customPostcode ? invoice.customPostcode
      : `${address.postcode || ''}`;
    const clientFinalAddress = `${streetAddress}, ${customState} ${customPostcode}`;

    return clientFinalAddress;
  }

  getPaymentLinks(visit){
    return `https://payments.getjarvis.com.au/pay/${_.get(visit, 'client.id')}`;
  }

  concatAddressLines(line1, line2){
    if (!line2){
      return line1;
    }

    return line1 + ' ' + line2;
  }

  // used for quick testing
  mockVisitData(options){
    return {
      date: options.date,
      charge: {
        amountAfterDiscount: 5000,
        amount: 10000,
        description: 'this is custom description'
      },
      client: {
        id: 'xoxoxox',
        firstName: 'cfname',
        lastName: 'lfname',
        email: 'test@g.com',
        phoneNumber: '10200202'
      },
      butler: {
        firstName: 'bname',
        lastName: 'blast',
        email: 'fake-5749233@email.com'
      },
    };
  }

  getAmount(charge){
    const amountAfterDiscount = _.get(charge, 'amountAfterDiscount');
    if(amountAfterDiscount != null){
      return amountAfterDiscount;
    }

    return _.get(charge, 'amount') || '';
  }
  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }
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

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
