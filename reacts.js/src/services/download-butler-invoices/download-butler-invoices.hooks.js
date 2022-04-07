const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow } = require('feathers-hooks-common');
// const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');

const restrict = [
  authenticate('jwt'),
  // restrictOnForeignId({
  //   exemptRoles: ['butler'],
  //   foreignField: 'butlerId'
  // })
];

module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [ disallow() ],
    create: [ disallow() ],
    update: [ disallow() ],
    patch: [ disallow() ],
    remove: [ disallow() ]
  },

  after: {
    all: [ ],
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
