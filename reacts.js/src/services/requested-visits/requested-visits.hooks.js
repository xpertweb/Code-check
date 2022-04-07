const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const { requestedVisitsSchema } = require('../../models/requested-visits.model');
const augmentFindQuery = require('./hooks/remove-unallocated-butler');
const { increaseNoOfRequests, decreaseNoOfRequests }  = require('./hooks/set_number_of_VisitPlan.hook')

const validate = [ ...requestedVisitsSchema.hooks ];

const restrict = [
  authenticate('jwt'),
  restrictOnForeignId({
    exemptRoles: ['operator'],
    foreignField: 'butlerId'
  })
];

module.exports = {
  before: {
    all: [...restrict],
    find: [(hook) => {
      if (hook.params.query.visitPlanId){
        return augmentFindQuery([{
          type: 'leftJoin',
          with: 'butlers',
          localId: 'butlerId',
          foreignId: 'id',
          asPrefix: 'butlers',
          select: ['id','firstName', 'lastName', 'email', 'managedSchedule', 'churnsPerClientRating']
        }])(hook);
      }
      return hook;
    }],
    get: [],
    create: [...validate ],
    update: [...validate ],
    patch: [...validate ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [increaseNoOfRequests()],
    update: [],
    patch: [],
    remove: [decreaseNoOfRequests()]
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
