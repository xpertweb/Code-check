const auth = require('feathers-authentication').hooks;
const common = require('feathers-hooks-common');
const isAction = (...args) => hook => args.includes(hook.data.action);
const logger = require('winston');

module.exports = {
  before : {
    all: [],
    find: [],
    get: [],
    create: [
      common.iff(isAction('passwordChange', 'identityChange'),
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
      ),
    ],
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
    update: [],
    patch: [],
    remove: []
  }
};