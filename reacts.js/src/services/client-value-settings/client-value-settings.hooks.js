const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');

const { clientValueSettingsSchema } = require('../../models/client-value-settings.model');

const validate = [ ...clientValueSettingsSchema.hooks ];

const restrict = [
  authenticate('jwt'),
];

const roleRestrict = restrictToRoles({
  roles: ['operator'],
  idField: 'id',
  ownerField: 'id',
});

module.exports = {
  before: {
    all: [...restrict], 
    find: [],// all logged in users can do find 
    get: [roleRestrict],
    create: [roleRestrict,...validate ],
    update: [roleRestrict,...validate ],
    patch: [roleRestrict,...validate ],
    remove: [roleRestrict]
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
