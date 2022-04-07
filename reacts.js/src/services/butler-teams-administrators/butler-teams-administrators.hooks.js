const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerTeamsAdministratorsSchema } = require('../../models/butler-teams-administrators.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const augmentFindQuery = require('../../hooks/augment-find-query');
const servicesEntityModifier  = require('../helpers/modifier-operators');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator','butler']
  })
];

const validate = [...butlerTeamsAdministratorsSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.createdAt = new Date();
  return hook;
}
function changeLastModifiedToCreatedBy(hook){
  hook.data.createdBy=hook.data.lastModifiedBy;
  delete hook.data.lastModifiedBy;
}

module.exports = {
  before: {
    all: [...restrict],
    find: [
      augmentFindQuery([
        {
          type: 'leftJoin',
          with: 'butlerTeams',
          localId: 'butlerTeamId',
          foreignId: 'id',
          asPrefix: 'butlerTeam',
          select: [
            'id',
            'name',
            'createdBy',
            'dateTimeCreated'
          ]
        }
      ])],
    get: [],
    create: [...validate, attachTimeStamp,servicesEntityModifier(),changeLastModifiedToCreatedBy],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
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
