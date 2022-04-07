const Promise = require('bluebird');
const pdf = Promise.promisifyAll(require('html-pdf'));
const moment = require('moment');
const _ = require('lodash');

function err(error){
  return {status: 'error', response: error};
}

function ok(pdf){
  return {status: 'success', response: pdf};
}


function getAmount(charge){
  const amountAfterDiscount = _.get(charge, 'amountAfterDiscount');
  if(amountAfterDiscount != null){
    return amountAfterDiscount;
  }

  return _.get(charge, 'amount') || '';
}


function mockVisitData(date){
  return {
    id: 'ckg9gzkp0w7il0868690r92vi',
    date: '2020-10-14T00:00:00.000Z',
    fee: {
      amount: 3000,
      description: 'Fee for Satya Deb visit of 01:00 hours on 2020-10-14'
    },
    client: {
      id: 'ckecpix1ffv7a0753035jbvv9',
      firstName: 'Satya',
      lastName: 'Deb',
      email: 'satyadeb0408@gmail.com',
      phoneNumber: '+61887678767',
      payments: [
        {
          description: 'Charge for visit of 01:00 hours on 2020-10-19',
          amount: 3500,
          date: '2020-10-19T16:07:54.092Z',
          stripePaymentId: 'ch_1He0tpL5sfv1s0oFsKWvfvcN'
        }
      ]
    },
    charge: {
      amount: 3500,
      description: 'Charge for visit of 01:00 hours on 2020-10-14'
    },
    butler: {
      id: 'cke3qkd03tqp90753sq94yjig',
      firstName: 'Satya',
      lastName: 'D',
      email: 'satyadipon@getjarvis.com.au',
      payments: []
    }
  };
}

function randomStringGenerator() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}


async function getInvoice(knex, serviceId){
  const invoice = await knex
    .from('serviceInvoicing')
    .where('serviceId', serviceId)
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

  return _.first(invoice);
}


function fmtButlerAddress(butler){
  const line1 = _.get(butler, 'address.line1') || '';
  const line2 = _.get(butler, 'address.line2') || '';
  const locale = _.get(butler, 'address.locale') || '';
  const state = _.get(butler, 'address.state') || '';
  const postcode = _.get(butler, 'address.postcode') || '';

  return `${concatAddressLines(line1, line2)} ${locale} ${state} ${postcode}`;
}

function concatAddressLines(line1, line2){
  if (!line2){
    return line1;
  }

  return line1 + ' ' + line2;
}

function createPDF(html) {
  const createResult = pdf.create(html, { format: 'A4' });
  const pdfToBuffer = Promise.promisify(createResult.__proto__.toBuffer, {
    context: createResult
  });
  return pdfToBuffer();
}

function genPaymentList(invoiceDate, description, amount){
  return `
    <tr class="details">
      <td>1</td>
      <td>${invoiceDate}</td>
      <td>${description}</td>
      <td>$${amount}</td>
    </tr>
  `;
}


function fmtDescription(visit){
  return _.get(visit, 'charge.description') || 'N/A';
}


function fmtClientAddress(address){
  const streetAddress =  `${address.line1 || ''}, ${address.line2|| ''} ${address.locale || ''}`;
  const customState = address.state || '';
  const customPostcode = address.postcode || '';
  const clientFinalAddress = `${streetAddress}, ${customState} ${customPostcode}`;

  return clientFinalAddress;
}

function formatDate(date){
  return moment(date, 'YYYY-MM-DDThh:mm:ss.sssZ').format('YYYY-MM-DD');
}

function getPaymentLinks(visit){
  return `https://payments.getjarvis.com.au/pay/${_.get(visit, 'client.id')}`;
}





module.exports = {
  ok,
  err,
  getInvoice,
  randomStringGenerator,
  mockVisitData,
  getAmount,
  fmtButlerAddress,
  fmtDescription,
  createPDF,
  genPaymentList,
  fmtClientAddress,
  getPaymentLinks,
  formatDate
}
