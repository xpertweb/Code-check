const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerBankDetailsModel } = require('../../models/butler-bank-details.model');
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const allowOperatorAllOrButlerSelf = require('../../permissions/allow-operator-all-or-butler-self');
const createUpdatePaymentsPlatformStripeAccount = require('./hooks/create-update-payments-platform-stripe-account.hook');
const loadUserSendingRequest = require('../../hooks/load-user-sending-request');

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator','butler'],
    foreignField: 'butlerId'
  })
];

function attachTimeStamp(hook) {
  hook.data.lastModifiedDateTime = new Date();
  return hook;
}

const validate = [...butlerBankDetailsModel.hooks];

module.exports = {
  before: {
    all: [],
    find: [
      ...allowOperatorAllOrButlerSelf('butlerId')],
    get: [...restrict],
    create: [
      ...restrict,
      ...validate,
      attachTimeStamp,
      loadUserSendingRequest()
    ],
    update: [
      ...allowOperatorAllOrButlerSelf('butlerId'), 
      ...validate,
      attachTimeStamp,
      loadUserSendingRequest(),
      createUpdatePaymentsPlatformStripeAccount()
    ],
    patch: [
      ...allowOperatorAllOrButlerSelf('butlerId'), 
      ...validate,
      attachTimeStamp,
      loadUserSendingRequest(),
      createUpdatePaymentsPlatformStripeAccount()
    ],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
    ],
    update: [
    ],
    patch: [
    ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
