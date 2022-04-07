const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { operatorSchema } = require('../../models/operators.model');
const local = require('@feathersjs/authentication-local');
const hashPassword = require('../../hooks/hash-password');
const createUserIdentity = require('../../hooks/create-user-identity');
const removeUserIdentity = require('../../hooks/remove-user-identity');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['operator'],
    idField: 'id',
    ownerField: 'id'
  })
];

const validate = operatorSchema.hooks;

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [],
    find: [...restrict],
    get: [...restrict],
    create: [...restrict, hashPassword(), ...validate, attachTimeStamp, createUserIdentity()],
    update: [...restrict, hashPassword(), ...validate],
    patch: [...restrict, hashPassword(), ...validate],
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
