
const { serialize, discard } = require('feathers-hooks-common');
const validateRange = require('./validate-range');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function serializeRange (hook) {
    const { lowerBoundField, upperBoundField, serializedField } = options;

    hook = validateRange(options)(hook);

    const doSerialize = serialize({
      computed: {
        [serializedField]: (item) => {
          const lower = item[lowerBoundField] || '';
          const upper = item[upperBoundField] || '';
          return `[${lower},${upper})`;
        }
      },
      exclude: [lowerBoundField, upperBoundField]
    });

    return Promise.resolve(discard('_computed')(doSerialize(hook)));
  };
};
