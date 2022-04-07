const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerAndButlerTeamSchema } = require('../../models/butler-and-butler-teams.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const augmentFindQuery = require('../../hooks/augment-find-query');
const servicesEntityModifier  = require('../helpers/modifier-operators');
const getAllButlerTeamsOnly = require('./hooks/get-all-butler-teams-only');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator','butler']
  })
];

const validate = [...butlerAndButlerTeamSchema.hooks];

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
          with: 'butlers',
          localId: 'butlerId',
          foreignId: 'id',
          asPrefix: 'butler',
          select: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'activeClients'
          ]
        },
        {
          type: 'leftJoin',
          with: 'butlerTeamsAdministrators',
          localId: 'butlerTeamId',
          foreignId: 'butlerTeamId',
          asPrefix: 'butlerTeamsAdministrators',
          select: [
            'id',
            'butlerId'
          ]
        },
        {
          type: 'leftJoin',
          with: 'butlerTeams',
          localId: 'butlerTeamId',
          foreignId: 'id',
          asPrefix: 'butlerTeams',
          select: [
            'id',
            'name',
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
    find: [getAllButlerTeamsOnly()],
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
