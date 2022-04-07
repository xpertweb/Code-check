
const { getItems } = require('feathers-hooks-common');
const { BadRequest } = require('@feathersjs/errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function validateRange (hook) {
    const { lowerBoundField, upperBoundField } = options;

    let items = getItems(hook);
    items = Array.isArray(items) ? items : [items];

    items.forEach((item) => {
      if (item[lowerBoundField] > item[upperBoundField]) {
        throw new BadRequest('Invalid range', {
          errors: {
            [lowerBoundField]: 'Cannot be greater than \'' + upperBoundField + '\''
          }
        });
      }
    });

    return hook;
  };
};
