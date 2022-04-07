const { authenticate } = require('@feathersjs/authentication').hooks;
const { googleClientSchema } = require('../../models/google-clients.model');
const hashPassword = require('../../hooks/hash-password');
const createUserIdentity = require('../../hooks/create-user-identity');
const removeUserIdentity = require('../../hooks/remove-user-identity');
const local = require('@feathersjs/authentication-local');

const restrict = [
  authenticate('jwt'),

];


function customizeGoogleProfile() {
  return function (hook) {

    if (hook.data.google) {
      hook.data.email = hook.data.google.profile.emails
        .find(email => email.type.toLowerCase() === 'account').value;
      hook.data.firstName = hook.data.google.profile.name.givenName;
      hook.data.lastName = hook.data.google.profile.name.familyName;
    }

    return Promise.resolve(hook);
  };
}

const validate = googleClientSchema.hooks;

module.exports = {
  before: {
    all: [],
    find: [...restrict],
    get: [...restrict],
    create: [
      customizeGoogleProfile(),
      hashPassword(),
      ...validate,
      createUserIdentity()
    ],
    update: [
      customizeGoogleProfile(),
      ...restrict,
      hashPassword(),
      ...validate,
    ],
    patch: [
      customizeGoogleProfile(),
      ...restrict,
      hashPassword(),
      ...validate,
    ],
    remove: [...restrict]
  },

  after: {
    all: [local.hooks.protect('password')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [removeUserIdentity()]
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
