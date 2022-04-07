const { authenticate } = require('@feathersjs/authentication').hooks;
const { butlerStrikesSchema } = require('../../models/butler-strikes.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const augmentFindQuery = require('../../hooks/augment-find-query');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [...butlerStrikesSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.dateTimeCreated = new Date();
  return hook;
}

module.exports = {
  before: {
    all: [...restrict],
    find: [
      augmentFindQuery([
        {
          type: 'leftJoin',
          with: 'butlerStrikeCategories',
          localId: 'reasonId',
          foreignId: 'id',
          asPrefix: 'strikeReason',
          select: [
            'id',
            'reason'
          ]
        }
      ])
    ],
    get: [],
    create: [...validate, attachTimeStamp],
    update: [...validate],
    patch: [...validate],
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
