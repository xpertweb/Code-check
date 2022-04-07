const { authenticate } = require('@feathersjs/authentication').hooks;
const { BadRequest } = require('@feathersjs/errors');
const roleShouldBe = require('../../hooks/role-should-be');
const validateEquipmentStock = require('../../hooks/validate-equipment-stock');
const { butlerEquipmentRequestsSchema } = require('../../models/butler-equipment-requests.model');

// User cannot create request for 0 items
function validateQuantity(hook) {
  const indexes = ['maskQuantity', 'gloveQuantity', 'disinfectantQuantity'];
  const total = indexes.map(index => Math.abs(hook.data[index])).reduce((x, y) => x + y, 0);

  const error = 'Quantity for at least one item should be present.';
  if (total === 0)
    return Promise.reject(new BadRequest(error, {errors: {error}}));
  return Promise.resolve(hook);
}

function requiredButlerAddressId(hook){
  const {type, butlerAddressId} = hook.data;
  if (!butlerAddressId && type === 'request'){
    return Promise.reject(new BadRequest('butlerAddressId is required', {
      errors: {error: 'Butler Address is required.'}
    }))
  }
  return Promise.resolve(hook);
}


// receipt is required in bought request
function receiptRequired(hook){
  const {receipt, type} = hook.data;
  if (receipt === '' && type === 'bought'){
    return Promise.reject(new BadRequest('Receipt is required', {
      errors: {error: 'Receipt is required.'}
    }))
  }

  return Promise.resolve(hook);
}





module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      roleShouldBe('butler', 'operator'),
      ...butlerEquipmentRequestsSchema.hooks,
      validateQuantity,
      receiptRequired,
      requiredButlerAddressId,
      validateEquipmentStock(),
    ],
    update: [],
    patch:  [
      roleShouldBe('operator'), 
      validateEquipmentStock('patch')
    ],
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
