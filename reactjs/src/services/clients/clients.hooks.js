const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { clientSchema } = require('../../models/clients.model');
const hashPassword = require('../../hooks/hash-password');
const addCreationDate = require('../../hooks/creation-date-hook');
const createUserIdentity = require('../../hooks/create-user-identity');
const removeUserIdentity = require('../../hooks/remove-user-identity');
const createClientInPayments = require('../../hooks/create-client-in-payments-platform');
const local = require('@feathersjs/authentication-local');
const handleCreateUserErrorVerifyIfPreExistingUser = require('../../hooks/handle-create-user-error-and-verify-if-pre-existing-user');
const commonHooks = require('feathers-hooks-common');
const giveClientInitialValues = require('../../hooks/give-client-initial-values');
const allowOperatorAllOrClientSelf = require('../../permissions/allow-operator-all-or-client-self'); 
const preventPropertiesChanges = require('./hooks/prevent-properties-changes');
const notifyFacebookIfThisIsNewLead = require('./hooks/notify-facebook-if-this-is-new-lead');
const setIsVerifiedFlag = require('./hooks/set-is-verified-flag');

const verifyHooks = require('feathers-authentication-management').hooks;
const accountService = require('../auth-management/notifier');
const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['operator'],
    idField: 'id',
    ownerField: 'id',
    owner: true
  })
];

const validate = clientSchema.hooks;

function preventSalesForceLeadId(hook){
  if (hook.params.user && hook.params.user.roles[0] != 'operator'){
    delete hook.data.salesForceLeadId;
  }
  return hook;
}

module.exports = {
  before: {
    all: [],
    find: [...allowOperatorAllOrClientSelf()],
    get: [...restrict],
    create: [
      hashPassword(),
      verifyHooks.addVerification(),
      ...validate,
      setIsVerifiedFlag(),
      giveClientInitialValues(),
      createUserIdentity(),
      addCreationDate(),
      notifyFacebookIfThisIsNewLead(true),
      preventSalesForceLeadId
    ],
    update: [
      ...restrict,
      hashPassword(),
      ...validate,
      preventPropertiesChanges(),
      notifyFacebookIfThisIsNewLead(),
      preventSalesForceLeadId
    ],
    patch: [
      commonHooks.iff(
        commonHooks.isProvider('external'),    
        commonHooks.preventChanges(true,
          'email',
          'password',
          'isVerified',
          'verifyToken',
          'googleId',
          'facebookId',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires',
          'dateTimeCreated'
        )),
      ...restrict,
      ...validate,
      preventPropertiesChanges(),
      notifyFacebookIfThisIsNewLead(true),
      preventSalesForceLeadId
    ],
    remove: [...restrict]
  },
  after: {
    all: [local.hooks.protect('password')],
    find: [],
    get: [],
    create: [
      createClientInPayments(),
      context => {
        const clientBeingCreated = true;
        accountService(context.app).notifier('resendVerifySignup', context.result,clientBeingCreated);
      },
      verifyHooks.removeVerification()
    ],
    update: [],
    patch: [],
    remove: [removeUserIdentity()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [handleCreateUserErrorVerifyIfPreExistingUser()],
    update: [],
    patch: [],
    remove: []
  }
};
