const { BadRequest } = require('@feathersjs/errors');
const _ = require('lodash');
const axios = require('axios');
const logger = require('winston');

/* eslint-disable no-unused-vars */


class ClientDetails {
  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    try {
      const email = params.query.email;
      const paymentToken = params.query.paymentToken;
      const existingEmail = params.query.existingEmail; 
      const clientQuery = this.knex.select(this.knex.raw('count(id)')).from("clients").where('email', email);
      const resp = await clientQuery;
      const clientIdInPayment = await this.getPaymentClientId(existingEmail, paymentToken);
      let newEmailCLientId;
      if(clientIdInPayment) {
       newEmailCLientId = await this.getPaymentClientId(email, paymentToken);
      }
      const count = {
        core: resp && resp.length && resp[0].count == '1' ? 1 : 0,
        payment: clientIdInPayment ? 1 : 0,
        newEmailInPayment: newEmailCLientId ? 1: 0
      }
      return count;
    } catch (error) {
      console.log('error in client details find method : ', error)
      return { core: 0, payment: 0 }
    }
  }

  async getPaymentClientId(email, paymentToken) {
    if (paymentToken) {
      const getPaymentClinetIdQuery = `query Clients {
          clients (
            where:{
              email: ${JSON.stringify(email)}
          }
            ){
            id
          }
        }`;
      const { data } = await axios({
        url: process.env.PAYMENTS_URI,
        method: 'post',
        headers: { Authorization: `Bearer ${paymentToken}` },
        data: { query: getPaymentClinetIdQuery }
      })
      const clientIdInPayment = data.data && data.data.clients && data.data.clients[0] && data.data.clients[0].id;
      return clientIdInPayment;
    }
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

  validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  async patch(id, email) {
    const newEmail = email.newEmail;
    const existingEmail = email.existingEmail;
    if (newEmail && newEmail != '' && this.validateEmail(newEmail)) {
      const isUniqueEmailAddress = await this.isUniqueEmailAddress(newEmail);
      if (isUniqueEmailAddress) {
        const success = await this.syncEmail(existingEmail, newEmail, email.paymentToken);
        if (success) {
          return Promise.resolve({ id, email: newEmail });
        } else {
          return Promise.reject(new BadRequest('Failed to update email'));
        }
      } else {
        return Promise.reject(new BadRequest('Email Already exist'));
      }
    } else {
      return Promise.reject(new BadRequest('Invalid Email'));
    }
  }


  async syncEmail(existingEmail, newEmail, paymentToken) {
    const url = process.env.PAYMENTS_URI + '/stripe/stripeEmailUpdate';
    try {
      logger.info(`Updating email in Core`)
      const coreUpdated = await this.knex('clients').where('email', existingEmail).update({
        email: newEmail
      });
      if (coreUpdated) {
        const clientIdPayment = await this.getPaymentClientId(existingEmail, paymentToken);
        const updatePaymentsClientEmail = `mutation {
          updateClient(
          id: "${clientIdPayment}"
          data: {
                  email: "${newEmail}"
                }
        ) {
          id
          email
          stripe
        }
      }`;
        logger.info(`Updating email in Payment`);
        const { data } = await axios({
          url: process.env.PAYMENTS_URI,
          method: 'post',
          headers: { Authorization: `Bearer ${paymentToken}` },
          data: { query: updatePaymentsClientEmail }
        })
        if (data.data && data.data.updateClient && data.data.updateClient.stripe) {
          logger.info(`Updating email in Stripe`);
          await axios({
            url: url,
            method: 'post',
            headers: { Authorization: `Bearer ${paymentToken}` },
            data: { existingEmail, newEmail }
          })
        } else if (!data.data) {
          logger.info(`Rolling back core update`);
          await this.knex('clients').where('email', newEmail).update({
            email: existingEmail
          });
          return false
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error('Error in updating email ' + error.message);
      return new BadRequest('Bad Request', { error: error.message });
    }
  }

  async isUniqueEmailAddress(email) {
    let client = await this.knex('clients').where({ email: email })
    return client && client.length ? false : true;
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }

}

module.exports = function (options) {
  return new ClientDetails(options);
}
module.exports.Service = ClientDetails;
