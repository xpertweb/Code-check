// Application hooks that run for every service
const logger = require('./hooks/logger');

const { disableMultiItemChange } = require('feathers-hooks-common');
const disableBatchRequests = require('./hooks/disable-batch-requests');

const parseFlatObjects = require('./hooks/parse-flat-objects');

module.exports = {
  before: {
    all: [disableBatchRequests()],
    find: [],
    get: [],
    create: [],
    update: [disableMultiItemChange()],
    patch: [disableMultiItemChange()],
    remove: [disableMultiItemChange()]
  },

  after: {
    all: [logger(), parseFlatObjects()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
