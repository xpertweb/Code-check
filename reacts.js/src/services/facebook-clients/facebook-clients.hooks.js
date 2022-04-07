const { authenticate } = require('@feathersjs/authentication').hooks;
const { facebookClientSchema } = require('../../models/facebook-clients.model');
const hashPassword = require('../../hooks/hash-password');
const createUserIdentity = require('../../hooks/create-user-identity');
const removeUserIdentity = require('../../hooks/remove-user-identity');
const local = require('@feathersjs/authentication-local');

const restrict = [
  authenticate('jwt'),
];

const validate = facebookClientSchema.hooks;


function customizeFacebookProfile() {
  return function (hook) {

    if (hook.data.facebook) {
      hook.data.email = hook.data.facebook.profile._json.email;
      hook.data.firstName = hook.data.facebook.profile._json.first_name;
      hook.data.lastName = hook.data.facebook.profile._json.last_name;
      hook.data.facebookId = hook.data.facebook.profile._json.id;
    }

    return Promise.resolve(hook);
  };
}

module.exports = {
  before: {
    all: [],
    find: [...restrict],
    get: [...restrict],
    create: [
      customizeFacebookProfile(),
      hashPassword(),
      ...validate,
      createUserIdentity()
    ],
    update: [
      customizeFacebookProfile(),
      ...restrict,
      hashPassword(),
      ...validate,
    ],
    patch: [
      customizeFacebookProfile(),
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
