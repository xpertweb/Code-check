const Promise = require('bluebird');
const pdf = Promise.promisifyAll(require('html-pdf'));
const template = require('../mail-templates/invoice-template.js');


const generatePdf = async (template) => {
  let createResult = pdf.create(template, { format: 'A4' });
  let pdfToBuffer = Promise.promisify(createResult.__proto__.toBuffer, { context: createResult });
  let bufferResult = await pdfToBuffer();
  return bufferResult;
}
export async function createInvoice(data, ) {
   
    let invoicTemplate = template
      .replace(/@@client_name@@/g,data.client_name)
      .replace(/@@invoice_date@@/g, data.invoice_date)
      .replace(/@@client_email@@/g, data.client_email)

      .replace(/@@client_address@@/g, data.client_address)
      .replace(/@@butler_name@@/g, data.butler_name)
      .replace(/@@butler_email@@/g, data.butler_email)
      .replace(/@@butler_address@@/g, data.butler_address)
      .replace(/@@ABN@@/g, data.ABN)
      .replace(/@@fees@@/g, data.fees)
      .replace(/@@htmlPaymentList@@/g, data.htmlPaymentList)
      .replace(/@@total_amount@@/g, data.total_amount)
      .replace(/@@invoice_number@@/g, data.invoice_number)

      let bufferResult = await generatePdf(invoicTemplate);
      return bufferResult
  }