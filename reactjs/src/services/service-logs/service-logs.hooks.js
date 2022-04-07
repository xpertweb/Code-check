const { authenticate } = require('@feathersjs/authentication').hooks;
const { ServiceLogsSchema } = require('../../models/service-logs.model');
const { restrictToRoles } = require('feathers-authentication-hooks');
const augmentFindQuery = require('../../hooks/augment-find-query');
const servicesEntityModifier  = require('../helpers/modifier-operators');

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    idField: 'id',
    roles: ['operator']
  })
];

const validate = [...ServiceLogsSchema.hooks];

function attachTimeStamp(hook) {
  hook.data.createdDateTime = new Date();
  return hook;
}


const getCreatedBy=async(hook) =>{
   
    if (hook.params.user) {
        const result = (await hook.app.service('operators').find({ query: { id: hook.params.user.id } }))[0];
        if (result) { // check if the modifier details is available
            let modifierOperator;
            const { firstName, lastName, email } = result;
            modifierOperator = `${firstName || ''} ${lastName || ''}`.trim()
            modifierOperator = modifierOperator === '' && email ? modifierOperator = email : modifierOperator = email ? modifierOperator + ` (${email})` : modifierOperator;
            hook.data.createdBy= modifierOperator;
            return hook;
        }
    }
    hook.data.createdBy= (hook.data.createdBy)?hook.data.createdBy:'N/A';
    return hook;
} 

module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [...validate,attachTimeStamp,getCreatedBy],
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
