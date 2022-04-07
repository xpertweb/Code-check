/* eslint-disable no-unused-vars */

const {
  getHistoricVisitFromPaymentsPlatform,
  getSingleHistoricVisitFromPayment
} = require("../../helpers/get-historic-visit-from-payments-platform");
const { createInvoice } = require("../../helpers/generate-invoice-pdf");
const moment = require("moment");
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
    this.knex = this.app.get("knexClient");
  }

  async find(params) {
    const {
      query: { date = new Date() },
      headers: { authorization = "" } = {}
    } = params;

    let invoiceQuery = this.knex.raw(`
    SELECT "services"."clientId" as "clientId",
    "services"."id" as "serviceID",
    "serviceInvoicing"."requiresTaxInvoice" as "requiresTaxInvoice",
    "serviceInvoicing"."description" as "description",
    "serviceInvoicing"."paymentMethod" as "paymentMethod",
    "serviceInvoicing"."frequency" as "frequency",
    "clients"."email" as "clientEmail",
    "clients"."firstName" as "clientFirstName",
    "clients"."lastName" as "clientLastName",
    "clients"."phoneNumber" as "clientPhoneNumber",
    "serviceCallHistory"."debtorCall" as "debtorCall",
    "serviceCallHistory"."debtorCallComment" as "debtorCallComment"
    FROM "public"."serviceInvoicing"
    LEFT JOIN "public"."services" on "serviceInvoicing"."serviceId" = "services"."id"
    RIGHT JOIN "clients" on "services"."clientId" = "clients"."id"
    LEFT JOIN "serviceCallHistory" on "services"."id" = "serviceCallHistory"."serviceId"
    WHERE "public"."serviceInvoicing"."requiresTaxInvoice" = true`);
    const invoices = (await invoiceQuery).rows;


    const clientEmails = invoices.map(invoice => invoice.clientEmail);

    const visits = await getHistoricVisitFromPaymentsPlatform({
      clientEmails,
      date,
      authorization
    });

    let modifyInvoices = [];
    if (visits && visits.length) {
      modifyInvoices = invoices.map(invoice => {
        let visited = false;
        if (visits.find(o => o.client.email === invoice.clientEmail)) {
          let newObj =
            visits[
              visits.findIndex(x => x.client.email == invoice.clientEmail)
            ];
          visited = true;
          invoice = { ...invoice, ...newObj };
        }
        return { ...invoice, visitOnDate: visited };
      });
    }
    let finalResponse = modifyInvoices.length ? modifyInvoices : invoices;
    return Promise.resolve({ invoices: finalResponse });
  }

  async get(id, params) {
    const { headers: { authorization = "" } = {} } = params;
    const invoiceId = randomStringGenerator();
    let invoiceQuery = this.knex
      .from("serviceInvoicing")
      .where({ requiresTaxInvoice: true, serviceId: id })
      .select([
        "services.clientId as clientId",
        "services.id as serviceID",
        "serviceInvoicing.recipientName as recipientName",
        "serviceInvoicing.recipientEmail as recipientEmail",
        "serviceInvoicing.requiresTaxInvoice as requiresTaxInvoice",
        "serviceInvoicing.description as description",
        "serviceInvoicing.recipientNumber as recipientNumber",
        "serviceInvoicing.paymentMethod as paymentMethod",
        "serviceInvoicing.frequency as frequency",
        "clients.email as clientEmail",
        "clients.firstName as clientFirstName",
        "clients.lastName as clientLastName",
        "clients.phoneNumber as clientPhoneNumber"
      ])
      .leftJoin("services", "serviceInvoicing.serviceId", "services.id")
      .rightJoin("clients", "services.clientId", "clients.id");

    const [invoice] = await invoiceQuery;

    if (invoice) {
      let [visit] = await getSingleHistoricVisitFromPayment(
        invoice.clientEmail,
        authorization,
        params.query.date
      );
      if (!visit) {
        return Promise.resolve(null);
      }
      let {
        client: {
          id: clientId = "",
          firstName: clientFirstName = "",
          lastName: clientLastName = "",
          email: clientEmail = "",
          phoneNumber: clientPhoneNumber = ""
        } = {},
        butler: {
          id: butlerId = "",
          firstName: butlerFirstName = "",
          lastName: butlerLastName = "",
          email: butlerEmail = ""
        } = {},
        date ='',
      } = visit;

      const amount = this.getAmount(_.get(visit, 'charge')) / 100;
      // get the butler abn and phone number
      const [butler] = await this.app
        .service("butlers")
        .find({ query: { email: butlerEmail } });
      const [address] = await this.app
        .service("serviceAddresses")
        .find({ query: { serviceId: id } });


      let invoice_date = moment(date, "YYYY-MM-DDThh:mm:ss.sssZ").format(
        "YYYY-MM-DD"
      );

      const htmlPaymentList = `<tr class="details">
          <td>1</td>
          <td>${invoice_date}</td>
          <td>${visit.charge.description}</td>
          <td>$${amount}</td>
        </tr>`;


      let invoiceObj = {
        client_fName: clientFirstName,
        client_name: (invoice.recipientName ? invoice.recipientName : `${clientFirstName} ${clientLastName}`),
        invoice_date,
        invoice_number: invoiceId,
        client_email: (invoice.recipientEmail ? invoice.recipientEmail : clientEmail),
        client_address: `${address.line1 || ""}, ${address.line2||
          ""} ${address.locale || ""}, ${address.state} ${address.postcode}`,
        butler_name: `${butlerFirstName} ${butlerLastName}`,
        butler_email: butlerEmail,
        htmlPaymentList,
        butler_address: `${butler.address.line1 || ""} ${butler.address.line2 ||
          ""} ${butler.address.locale || ""} ${butler.address.state ||
          ""} ${butler.address.postcode || ""}`,
        ABN: butler.abnNumber || "N/A",
        fees: amount,
        total_amount: amount
      };
      const pdf_created = await createInvoice(invoiceObj);
      return Promise.resolve({ url: pdf_created.toString('base64') });
    } else {
      return Promise.resolve(null);
    }
  }

  getAmount(charge){
    const amountAfterDiscount = _.get(charge, 'amountAfterDiscount') || '';
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
