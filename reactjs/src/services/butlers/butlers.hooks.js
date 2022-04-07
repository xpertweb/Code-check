const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { butlerSchema } = require('../../models/butlers.model');
const hashPassword = require('../../hooks/hash-password');
const createUserIdentity = require('../../hooks/create-user-identity');
const giveButlerInitialValues = require('../../hooks/give-butler-initial-values');
const removeUserIdentity = require('../../hooks/remove-user-identity');
const augmentFindQuery = require('../../hooks/augment-find-query');
const { protect } = require('@feathersjs/authentication-local').hooks;
const allowOperatorAllOrButlerSelf = require('../../permissions/allow-operator-all-or-butler-self'); 
const commonHooks = require('feathers-hooks-common');
const addCreationDate = require('../../hooks/creation-date-hook');
const createButlerInPayments = require('../../hooks/create-butler-in-payments-platform');
const preventPropertiesChanges = require('./hooks/prevent-properties-changes');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['operator'],
    idField: 'id',
    ownerField: 'id',
    owner: true
  })
];

const validate = butlerSchema.hooks;

module.exports = {
  before: {
    all: [],
    find: [
      ...allowOperatorAllOrButlerSelf(),
      augmentFindQuery([
        {
          type: 'temporalJoin',
          with: 'butlerAddresses',
          localId: 'id',
          foreignId: 'butlerId',
          asPrefix: 'address',
          select: [
            'id',
            'line1',
            'line2',
            'locale',
            'state',
            'postcode',
            'country',
            'geopoint'
          ],
          instantField: 'activeFrom'
        }
      ]),
    ],
    get: [...restrict],
    create: [
      hashPassword(), 
      ...validate, 
      giveButlerInitialValues(), 
      createUserIdentity(),
      addCreationDate()],
    update: [...restrict, 
      preventPropertiesChanges(),
      commonHooks.iff(
        commonHooks.isProvider('external'),    
        commonHooks.preventChanges(true,
          'verified',
          'dateTimeCreated'
        )),
      hashPassword(), ...validate],
    patch: [...restrict, 
      preventPropertiesChanges(),
      commonHooks.iff(
        commonHooks.isProvider('external'),    
        commonHooks.preventChanges(true,
          'verified',
          'dateTimeCreated'
        )),
      ...validate],
    remove: [...restrict]
  },

  after: {
    all: [protect('password')],
    find: [],
    get: [],
    create: [
      createButlerInPayments()
    ],
    update: [],
    patch: [],
    remove: [removeUserIdentity()]
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
