const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictOnForeignId = require('../../hooks/restrict-on-foreign-id');
const { butlerVisitCheckinStatus } = require('../../models/butler-visit-checkin-status');
const creationDateHook = require('./hooks/creation-date-hook');
const setCheckinCancelledAfterBeingCheckedIn = require('./hooks/set-checkin-cancelled-after-being-checked-in');
const commonHooks = require('feathers-hooks-common');
const preventPropertiesChanges = require('./hooks/prevent-properties-changes');
const postEmailNotification = require('./hooks/post-email-notification-hook');
const updateServiceAssignmentDate = require('./hooks/update-service-assignment-date');
const attachRelatedData = require('./hooks/attach-related-data');

const validate = [ ...butlerVisitCheckinStatus.hooks ];

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
    find: [],
    get: [],
    create: [...validate,creationDateHook(),postEmailNotification() ],
    update: [...validate,
      preventPropertiesChanges(),
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(true,
          'dateTimeCheckinCreated',
          'scheduleModifiedAndCheckinNeedsToBeDoneAgain',
          'checkinCancelledAfterHavingBeenConfirmed'
        )),
      setCheckinCancelledAfterBeingCheckedIn(),
      postEmailNotification()
    ],
    patch: [...validate,
      commonHooks.iff(
        commonHooks.isProvider('external'),
        preventPropertiesChanges(),
        commonHooks.preventChanges(true,
          'dateTimeCheckinCreated',
          'scheduleModifiedAndCheckinNeedsToBeDoneAgain',
          'checkinCancelledAfterHavingBeenConfirmed'
        )),
      setCheckinCancelledAfterBeingCheckedIn(),
      postEmailNotification()
    ],
    remove: []
  },

  after: {
    all: [],
    find: [attachRelatedData()],
    get: [],
    create: [ updateServiceAssignmentDate() ],
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
