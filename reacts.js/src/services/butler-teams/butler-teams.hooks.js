const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerTeamsSchema } = require('../../models/butler-teams.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const servicesEntityModifier  = require('../helpers/modifier-operators');
const isAdmin = require('./hooks/isAdmin');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator','butler']
  })
];
const validate = [...butlerTeamsSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}
function changeLastModifiedToCreatedBy(hook){
  hook.data.createdBy=hook.data.lastModifiedBy;
  delete hook.data.lastModifiedBy;
}

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [...validate, attachTimeStamp,servicesEntityModifier(),changeLastModifiedToCreatedBy],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [isAdmin()],
    create: [],
    update: [],
    patch: [],
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
